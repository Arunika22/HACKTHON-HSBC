import requests
import feedparser
from bs4 import BeautifulSoup
from datetime import datetime
from backend.app.db import RawDocument


RSS_FEEDS = [
    'https://news.google.com/rss',
]


def fetch_rss_feed_entries(feed_url):
    parsed = feedparser.parse(feed_url)
    entries = []
    for e in parsed.entries:
        title = e.get('title', '')
        link = e.get('link', '')
        pub_date = e.get('published', None) or e.get('updated', None)
        entries.append({'title': title, 'link': link, 'pub_date': pub_date})
    return entries


def fetch_article_text(url):
    try:
        resp = requests.get(url, timeout=10, headers={'User-Agent': 'SentinelRiskBot/1.0'})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        paragraphs = [p.get_text(separator=' ', strip=True) for p in soup.find_all('p')]
        text = '\n\n'.join(paragraphs)
        return text
    except Exception:
        return ''


def harvest_rss(session, feed_url_list=RSS_FEEDS):
    docs = []
    for feed in feed_url_list:
        items = fetch_rss_feed_entries(feed)
        for it in items[:10]:
            content = fetch_article_text(it['link'])
            raw = RawDocument(source=feed, url=it['link'], title=it['title'], content=content)
            session.add(raw)
            docs.append(raw)
    session.commit()
    return docs
