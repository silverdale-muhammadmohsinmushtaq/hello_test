#!/usr/bin/env python3
"""
Script to search Google for "Antigravity" and "cursor" and create a comparison
"""

import urllib.request
import urllib.parse
import re
from html.parser import HTMLParser

class SearchResultParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.results = []
        self.in_result = False
        self.current_text = ""
        
    def handle_starttag(self, tag, attrs):
        if tag == 'h3':
            self.in_result = True
            
    def handle_endtag(self, tag):
        if tag == 'h3':
            if self.current_text.strip():
                self.results.append(self.current_text.strip())
            self.current_text = ""
            self.in_result = False
            
    def handle_data(self, data):
        if self.in_result:
            self.current_text += data

def search_duckduckgo(query):
    """Search DuckDuckGo for the query"""
    try:
        url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return html
    except Exception as e:
        print(f"Error searching DuckDuckGo: {e}")
        return None

def extract_results(html, query):
    """Extract search results from HTML"""
    results = []
    if not html:
        return results
    
    # Try to find result titles
    # DuckDuckGo uses class="result__a" for result links
    pattern = r'<a[^>]*class="result__a"[^>]*>(.*?)</a>'
    matches = re.findall(pattern, html, re.DOTALL)
    
    for match in matches[:10]:  # Get top 10 results
        # Clean HTML tags
        text = re.sub(r'<[^>]+>', '', match)
        text = text.strip()
        if text:
            results.append(text)
    
    # Also try to find snippets
    snippet_pattern = r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>'
    snippets = re.findall(snippet_pattern, html, re.DOTALL)
    
    return {
        'titles': results[:10],
        'snippets': [re.sub(r'<[^>]+>', '', s).strip() for s in snippets[:10]]
    }

def main():
    print("Searching for 'Antigravity'...")
    antigravity_html = search_duckduckgo("Antigravity")
    antigravity_results = extract_results(antigravity_html, "Antigravity")
    
    print("\nSearching for 'cursor'...")
    cursor_html = search_duckduckgo("cursor")
    cursor_results = extract_results(cursor_html, "cursor")
    
    # Create comparison document
    comparison = f"""# Comparison: Antigravity vs Cursor

## Search Results Analysis

### Antigravity Search Results

#### Top Results:
"""
    
    for i, title in enumerate(antigravity_results.get('titles', [])[:5], 1):
        comparison += f"{i}. {title}\n"
    
    comparison += "\n### Cursor Search Results\n\n#### Top Results:\n"
    
    for i, title in enumerate(cursor_results.get('titles', [])[:5], 1):
        comparison += f"{i}. {title}\n"
    
    comparison += """
## Key Differences

### Antigravity
- [To be filled based on search results]

### Cursor  
- [To be filled based on search results]

## Summary
[Summary of comparison]
"""
    
    print("\n" + "="*50)
    print(comparison)
    print("="*50)
    
    # Save to file
    with open('/workspace/comparison_results.md', 'w') as f:
        f.write(comparison)
    
    print("\nResults saved to comparison_results.md")

if __name__ == "__main__":
    main()
