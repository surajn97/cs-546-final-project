from pymongo import MongoClient
import numpy as np
import pandas as pd
import string
import re

import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyser = SentimentIntensityAnalyzer()

import warnings
warnings.filterwarnings('ignore')
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

def preprocessing(text):
    preprocessed=re.sub(r'[^\w\s]|\d+', ' ', text.lower())
    preprocessed = word_tokenize(preprocessed.strip())
    preprocessed = [word for word in preprocessed if not word in stopwords.words()]
    lem_sentence=[]
    for word in preprocessed:
        lem_sentence.append(lemmatizer.lemmatize(word))
    return " ".join(lem_sentence)

def sentiment_analyzer_scores(sentence):
    score = analyser.polarity_scores(sentence)
    c=score['compound']
    if(c<=-0.6):
        return 'strongly negetive'
    elif(c<=-0.2):
        return 'negetive'
    elif(c>=0.6):
        return 'strongly positive'
    elif(c>=0.2):
        return 'positive'
    else:
        return 'neutral'

def truesentiment(rating):
    sentiment=['strongly negetive','negetive','neutral','positive','strongly positive']
    return sentiment[rating-1]

def main():
    conn = MongoClient()
    db = conn.ProjectDB
    reviews = db.reviews
    cursor=reviews.find()
    a=[]
    for record in cursor:
        review= record["reviewText"]
        rating= record["rating"]
        prep=preprocessing(review)
    
        record["AnalysedSentiment"]=sentiment_analyzer_scores(prep)
    
        record["UserSentiment"]=truesentiment(rating)
        print(record["reviewText"])
        print(record["AnalysedSentiment"])
        print(record["UserSentiment"])

main()
    

