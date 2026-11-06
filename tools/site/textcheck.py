#!/usr/bin/env python3
"""Check the text image of the design record against its limits.

usage: python3 tools/site/textcheck.py [--quiet] [FILE.html ...]

Without files it checks docs/index.html and docs/design/*.html, except the
generated glossary page and the mockup gallery. The mockups are verbatim pages
and are not checked. Exit 1 on a finding.

Limits (the contributor rules are in .claude/skills/docs-steward/SKILL.md):
  sentence    at most 25 words; at most 20 in a step (an item of an ol).
              Exempt: 40 % or more of the words are code, or the sentence is an
              enumeration of names (commas >= words / 3).
  paragraph   at most 60 words and 6 sentences (p, li, dd).
  table cell  at most 40 words.
  headings    no level jump; no more than 400 words of running text without a
              heading.
  meta text   no "This section ...", "The table shows ...", "see above",
              "see below", "as described above".

The sentence splitter splits after . ! ? and white space, before any character
except . , ; : ) ] -. It does not split after e.g., i.e., etc., vs. Code is
masked first, so a dot in code never splits a sentence.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SKIP = {"design/glossary.html", "design/mockups/index.html"}
VOID = {"br", "img", "hr", "meta", "link", "input", "source", "wbr", "col", "area", "base", "embed", "param", "track"}
BLOCK = {"p", "li", "dd", "dt", "td", "th", "figcaption", "div", "ul", "ol", "dl", "table", "tr", "pre",
         "h1", "h2", "h3", "h4", "h5", "h6", "aside", "figure", "section", "thead", "tbody"}
ABBR = re.compile(r"\b(?:e\.g|i\.e|etc|vs|cf)\.$")
WORD = re.compile(r"[A-Za-z0-9]")
META = re.compile(r"\b(This section (?:specifies|describes|shows|covers|gives|lists)"
                  r"|The (?:table|list|diagram|figure) (?:below |above )?(?:shows|lists|gives)"
                  r"|as (?:described|shown|explained) (?:above|below)|see (?:above|below))\b", re.I)


class Node:
    __slots__ = ("tag", "attrs", "children", "parent", "line")

    def __init__(self, tag, attrs, parent, line):
        self.tag, self.attrs, self.children, self.parent, self.line = tag, dict(attrs), [], parent, line

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def ancestors(self):
        n = self.parent
        while n is not None:
            yield n
            n = n.parent


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None, 0)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur, self.getpos()[0])
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur, self.getpos()[0]))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def walk(n):
    for c in n.children:
        if isinstance(c, Node):
            yield c
            yield from walk(c)


def masked_text(n, codes, nested=False):
    """Text of n with code masked as ⟦i⟧. Nested blocks are left out unless nested=True."""
    out = []
    for c in n.children:
        if isinstance(c, str):
            out.append(c)
        elif c.tag in ("code", "kbd", "samp"):
            codes.append(" ".join(text_of(c).split()))
            out.append(f"⟦{len(codes) - 1}⟧")
        elif c.tag in ("svg", "script", "style"):
            continue
        elif c.tag in BLOCK and not nested:
            out.append(" ")
        elif c.tag == "br":
            out.append(" ")
        else:
            out.append(masked_text(c, codes, nested))
            if c.tag == "span":
                out.append(" ")
    return re.sub(r"\s+", " ", "".join(out)).strip()


def text_of(n):
    return "".join(c if isinstance(c, str) else text_of(c) for c in n.children)


def split_sentences(text):
    out, start, i, n = [], 0, 0, len(text)
    while i < n:
        if text[i] in ".!?":
            j = i + 1
            while j < n and text[j] in "\"'”’)":
                j += 1
            if j < n and text[j].isspace():
                k = j
                while k < n and text[k].isspace():
                    k += 1
                if k < n and text[k] not in ".,;:)]-" and not ABBR.search(text[start:i + 1]):
                    out.append(text[start:j].strip())
                    start = i = k
                    continue
        i += 1
    if text[start:].strip():
        out.append(text[start:].strip())
    return out


def count_words(s, codes):
    total = code = 0
    for tok in s.split():
        for m in re.finditer(r"⟦(\d+)⟧", tok):
            k = max(1, len(codes[int(m.group(1))].split()))
            total += k
            code += k
        if WORD.search(re.sub(r"⟦\d+⟧", "", tok)):
            total += 1
    return total, code


def unmask(s, codes):
    return re.sub(r"⟦(\d+)⟧", lambda m: codes[int(m.group(1))], s)


def check(path):
    t = Tree()
    t.feed(Path(path).read_text(encoding="utf-8"))
    found = []
    heading = "#top"
    run = 0
    last = 1
    pending_heading = None
    for n in walk(t.root):
        if any(a.tag in ("svg", "pre", "script", "template") for a in n.ancestors()):
            continue
        if re.fullmatch(r"h[1-6]", n.tag):
            lvl = int(n.tag[1])
            if lvl > last + 1:
                found.append((n.line, heading, "heading", f"level jump h{last} to h{lvl}"))
            if pending_heading is not None and pending_heading[1] >= lvl:
                found.append((pending_heading[0], heading, "heading", "empty heading"))
            pending_heading = (n.line, lvl) if lvl > 1 else None
            heading = "#" + n.attrs.get("id", "") if n.attrs.get("id") else heading
            last, run = lvl, 0
            continue
        if n.tag in ("p", "ul", "ol", "dl", "table", "pre", "figure", "aside", "div", "blockquote"):
            pending_heading = None
        if n.tag not in ("p", "li", "dd", "td", "th", "figcaption"):
            continue
        codes = []
        text = masked_text(n, codes)
        if not text:
            continue
        sents = split_sentences(text)
        step = n.tag == "li" and n.parent is not None and n.parent.tag == "ol"
        limit = 20 if step else 25
        words = 0
        for s in sents:
            w, c = count_words(s, codes)
            words += w
            enumeration = s.count(",") >= w / 3
            if w > limit and c / w < 0.4 and not enumeration:
                found.append((n.line, heading, "sentence", f"{w} words > {limit}: {unmask(s, codes)[:100]}"))
        if n.tag in ("td", "th"):
            if words > 40:
                found.append((n.line, heading, "cell", f"{words} words > 40: {unmask(text, codes)[:80]}"))
            continue
        if n.tag != "figcaption" and (words > 60 or len(sents) > 6):
            found.append((n.line, heading, "paragraph", f"{words} words, {len(sents)} sentences: {unmask(text, codes)[:80]}"))
        m = META.search(unmask(text, codes))
        if m:
            found.append((n.line, heading, "meta", m.group(0)))
        if n.tag == "p" and not any(a.tag in ("aside", "figure", "table", "li") for a in n.ancestors()):
            run += words
            if run > 400:
                found.append((n.line, heading, "heading", f"{run} words of running text without a heading"))
                run = -10 ** 9
    return found


def default_files():
    docs = ROOT / "docs"
    files = [docs / "index.html"] + sorted((docs / "design").glob("*.html"))
    return [f for f in files if str(f.relative_to(docs)) not in SKIP]


def main(argv):
    quiet = "--quiet" in argv
    files = [Path(a) for a in argv if not a.startswith("--")] or default_files()
    total = 0
    for f in files:
        res = check(f)
        total += len(res)
        name = f.relative_to(ROOT) if f.is_absolute() and ROOT in f.parents else f
        if quiet and res:
            print(f"{name}: {len(res)} findings")
        elif not quiet:
            for line, sec, kind, what in res:
                print(f"{name}:{line}: {sec}: {kind}: {what}")
    print(f"{total} findings in {len(files)} files")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
