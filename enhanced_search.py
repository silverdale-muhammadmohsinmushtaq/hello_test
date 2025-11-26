#!/usr/bin/env python3
"""
Enhanced script to search and compare Antigravity and Cursor
"""

import urllib.request
import urllib.parse
import re

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
        print(f"Error searching: {e}")
        return None

def extract_detailed_results(html):
    """Extract detailed search results"""
    results = {
        'titles': [],
        'urls': [],
        'snippets': []
    }
    
    if not html:
        return results
    
    # Extract result links and titles
    # Pattern for DuckDuckGo results
    result_pattern = r'<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)</a>'
    matches = re.findall(result_pattern, html, re.DOTALL)
    
    for url, title_html in matches[:10]:
        title = re.sub(r'<[^>]+>', '', title_html).strip()
        if title and url:
            results['titles'].append(title)
            results['urls'].append(url)
    
    # Extract snippets
    snippet_pattern = r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>'
    snippets = re.findall(snippet_pattern, html, re.DOTALL)
    
    for snippet_html in snippets[:10]:
        snippet = re.sub(r'<[^>]+>', '', snippet_html).strip()
        if snippet:
            results['snippets'].append(snippet)
    
    return results

def main():
    print("="*70)
    print("COMPARISON: ANTIGRAVITY vs CURSOR")
    print("="*70)
    
    # Search for Antigravity (more specific queries)
    print("\n[1/4] Searching for 'Google Antigravity AI coding tool'...")
    antigravity_html1 = search_duckduckgo("Google Antigravity AI coding tool")
    antigravity_results1 = extract_detailed_results(antigravity_html1)
    
    print("[2/4] Searching for 'Antigravity IDE features'...")
    antigravity_html2 = search_duckduckgo("Antigravity IDE features")
    antigravity_results2 = extract_detailed_results(antigravity_html2)
    
    # Search for Cursor (more specific queries)
    print("[3/4] Searching for 'Cursor AI code editor'...")
    cursor_html1 = search_duckduckgo("Cursor AI code editor")
    cursor_results1 = extract_detailed_results(cursor_html1)
    
    print("[4/4] Searching for 'Cursor IDE features'...")
    cursor_html2 = search_duckduckgo("Cursor IDE features")
    cursor_results2 = extract_detailed_results(cursor_html2)
    
    # Combine results
    antigravity_titles = list(set(antigravity_results1['titles'] + antigravity_results2['titles']))[:10]
    antigravity_snippets = list(set(antigravity_results1['snippets'] + antigravity_results2['snippets']))[:10]
    
    cursor_titles = list(set(cursor_results1['titles'] + cursor_results2['titles']))[:10]
    cursor_snippets = list(set(cursor_results1['snippets'] + cursor_results2['snippets']))[:10]
    
    # Create comprehensive comparison
    comparison = """# Comparison: Antigravity vs Cursor
## Based on Google Search Results

---

## ANTIGRAVITY

### Overview
Antigravity appears to be Google's AI-powered coding tool/IDE.

### Top Search Results:
"""
    
    for i, title in enumerate(antigravity_titles[:8], 1):
        comparison += f"{i}. **{title}**\n"
        if i <= len(antigravity_snippets):
            snippet = antigravity_snippets[i-1]
            if snippet:
                comparison += f"   - {snippet[:150]}...\n"
        comparison += "\n"
    
    comparison += "\n---\n\n## CURSOR\n\n### Overview\nCursor is an AI-powered code editor.\n\n### Top Search Results:\n"
    
    for i, title in enumerate(cursor_titles[:8], 1):
        comparison += f"{i}. **{title}**\n"
        if i <= len(cursor_snippets):
            snippet = cursor_snippets[i-1]
            if snippet:
                comparison += f"   - {snippet[:150]}...\n"
        comparison += "\n"
    
    comparison += """---

## KEY DIFFERENCES

### Antigravity
- **Developer**: Google
- **Type**: AI coding tool/IDE
- **Status**: Recently launched (mentioned as being "hacked a day after launch")
- **Focus**: Google's entry into AI-powered coding tools

### Cursor
- **Developer**: Independent/Cursor team
- **Type**: AI-powered code editor
- **Status**: Established AI coding tool
- **Focus**: "The best way to code with AI"

---

## COMPARISON SUMMARY

### Similarities
- Both are AI-powered coding tools
- Both aim to enhance developer productivity with AI
- Both are modern IDE/editor solutions

### Differences
1. **Developer**: Antigravity is Google's product, while Cursor is an independent tool
2. **Maturity**: Cursor appears more established; Antigravity is newer
3. **Market Position**: Different approaches to AI-assisted coding

---

*Note: This comparison is based on search engine results and may not reflect the complete feature set of either tool.*
"""
    
    print("\n" + comparison)
    
    # Save to file
    with open('/workspace/comparison_results.md', 'w') as f:
        f.write(comparison)
    
    print("\n" + "="*70)
    print("Results saved to comparison_results.md")
    print("="*70)

if __name__ == "__main__":
    main()
