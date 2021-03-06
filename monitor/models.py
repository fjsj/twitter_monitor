from django.db import models
from monitor import enums
from tweepy.error import TweepError
from twitter_monitor.twitter_api import get_api


class TwitterUser(models.Model):

    user_id = models.CharField(max_length=20)

    username = models.CharField(max_length=100, unique=True)

    status = models.IntegerField(
        choices=enums.TWITTER_USER_STATUS_CHOICES,
        default=enums.TwitterUserStatusEnum.SEARCHING)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

    @property
    def status_text(self):
        return self.get_status_display()

    def update_status(self, status):
        self.status = status
        self.save()

    def retrieve_tweets(self, user):
        try:
            social_user = user.social_auth.get()
            api = get_api(
                social_user.extra_data['access_token']['oauth_token'],
                social_user.extra_data['access_token']['oauth_token_secret']
            )

            user = api.get_user(self.username)
            tweets = user.timeline(count=200)

            for tweet in tweets:
                tweet_obj = Tweet.objects.create(
                    tweet_id=tweet.id, user=self, text=tweet.text,
                    date=tweet.created_at
                )
                for hashtag in tweet.entities.get('hashtags'):
                    tag, created = Hashtag.objects.get_or_create(
                        name=hashtag.get('text')
                    )
                    tweet_obj.hashtags.add(tag.id)

            self.update_status(enums.TwitterUserStatusEnum.VALID)
        except TweepError:
            self.update_status(enums.TwitterUserStatusEnum.INVALID)


class Hashtag(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Tweet(models.Model):

    tweet_id = models.CharField(max_length=20)

    user = models.ForeignKey(TwitterUser)

    text = models.TextField(max_length=140)

    date = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    hashtags = models.ManyToManyField(Hashtag)

    def __str__(self):
        return '{} - {}'.format(
            self.user, self.date.strftime('%d/%m/%Y %H:%I')
        )

    def reply(self, user, text):
        social_user = user.social_auth.get()
        api = get_api(
            social_user.extra_data['access_token']['oauth_token'],
            social_user.extra_data['access_token']['oauth_token_secret']
        )

        message = '@{} {}'.format(self.user.username, text)
        tweet = api.update_status(message, self.tweet_id)

        TweetResponse.objects.create(
            response_id=tweet.id, user=user, tweet=self, text=text
        )


class TweetResponse(models.Model):

    response_id = models.CharField(max_length=20)

    user = models.ForeignKey('users.User')

    tweet = models.ForeignKey(Tweet)

    text = models.TextField(max_length=140)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} ({})'.format(self.user, self.tweet)
