import requests
from bs4 import BeautifulSoup
from datetime import datetime
from backend.app.db import RawDocument


RSS_FEEDS = [
    'https://news.google.com/rss',
]


def fetch_rss_feed(feed_url):
    resp = requests.get(feed_url, timeout=10)
    resp.raise_for_status()
    return resp.text


def parse_rss_items(rss_xml):
    soup = BeautifulSoup(rss_xml, 'xml')
    items = []
    for item in soup.find_all('item'):
        title = item.title.string if item.title else ''
        link = item.link.string if item.link else ''
        pub_date = item.pubDate.string if item.pubDate else None
        items.append({'title': title, 'link': link, 'pub_date': pub_date})
    return items


def fetch_article_text(url):
    try:
        resp = requests.get(url, timeout=10, headers={'User-Agent': 'SentinelRiskBot/1.0'})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        # naive extraction: join paragraph texts
        paragraphs = [p.get_text(separator=' ', strip=True) for p in soup.find_all('p')]
        text = '\n\n'.join(paragraphs)
        return text
    except Exception:
        return ''


def harvest_rss(session, feed_url_list=RSS_FEEDS):
    docs = []
    for feed in feed_url_list:
        xml = fetch_rss_feed(feed)
        items = parse_rss_items(xml)
        for it in items[:10]:
            content = fetch_article_text(it['link'])
            raw = RawDocument(source=feed, url=it['link'], title=it['title'], content=content)
            session.add(raw)
            docs.append(raw)
    session.commit()
    return docs
