---
name: docs-steward
description: Use for any change to the design record in docs/ or to the site generator in tools/site/ (a new page, a new section, an edit of text, a diagram, CSS or JS). Gives the checklist that keeps the pages, the glossary, the project links, the mockups and the screenshots consistent.
---

# Docs steward

The design record of bembel is a static site. Write documents in HTML, not
in Markdown: a new chapter is an HTML fragment in `docs/design/`. `tools/site/build.py` (Python 3, standard
library only) wraps the HTML fragments in `docs/` with `tools/site/template.html`
and writes `_site/`. The docs workflow (`.github/workflows/docs.yml`) builds it
for each pull request and deploys `main` to GitHub Pages.

Use this checklist for each change. Do the steps that apply, and tell in the
pull request which steps you did.

## 1. Know the parts

| Part | File | Rule |
|---|---|---|
| Page | `docs/**/*.html` | An HTML fragment: one `<h1>`, then the content. No frame, no inline style, no colour. |
| Chapter list, anchors | `tools/site/nav.json` | Each page is in `parts[].pages[]`. Each `id` that other pages or the "On this page" list need is in `anchors`. |
| Authoring classes | `CONTRACT_CLASSES` in `tools/site/build.py` | Use only these classes. A new class goes into this set and into `docs/assets/site.css`. |
| Glossary | `docs/assets/glossary-data.js` | The one source of the project words. Use the skill `docs-glossary`. |
| Other projects | `tools/site/projects.json` | A tool name or `owner/name` that links to GitHub. Use the skill `docs-glossary`. |
| Web UI mockups | `docs/design/mockups/ui/*.html` | Verbatim pages, not wrapped. Use the skill `docs-mockups`. |
| Screenshots | `docs/design/img/*.webp` | Made from the mockups with `tools/site/shots.mjs`. Never edit by hand. |
| Site CSS and JS | `docs/assets/` | The build adds `?v=<hash>` to their URLs. Do not add a version by hand. |

## 2. Write the text

- Write in ASD-STE100 (Simplified Technical English): short sentences, one
  instruction per sentence, active voice, approved words. Use one word for one
  concept: the word of the glossary.
- Say "user" for a human who uses bembel and "service" for a machine
  identity (a token, a Kubernetes service account, an agent). Never "person"
  or "people". The API uses the same words (`subject.kind: user | group |
  service`).
- Use the present tense for the design ("bembel derives the PTR record").
- When you use a project concept (prefix, subnet, claim, binding, scope,
  derived record, export and so on), use the exact glossary word. The build links its first use in each
  section. Do not write the link or the dotted underline by hand.
- A new concept that a reader must know: add it to the glossary in the same
  change (skill `docs-glossary`).
- An other tool or git repository by name (`brig`, `mock`,
  `GSI-HPC/go-clikit`, `NetBox`): the build links its first use in each section to
  `https://github.com/<owner>/<name>`. A name that is not in
  `tools/site/projects.json` stays plain: add it.
- Do not write a link by hand to a word that the build links. Write a link by
  hand only for a specific page (a release, an issue, a file).
- Put text in `<span class="no-gl">` when a word must stay plain (for example
  the English verb "run" where the build wrongly links the glossary term).
- Headings, code, links, `<dfn>`, `<th>`, `<dt>` and `.callout-title` never get
  links. Thus a definition list or a table head stays plain.
- The authoring classes are in the README ("Write a page"): `p.lede`,
  `ul.keypoints`, `aside.callout` (`note`, `rule`, `why`, `warn`, `tip`),
  `pre.term`, `pre > code.language-*`, `span.tag`, `figure.diagram`,
  `figure.shot`.

## 2a. Keep the text compact

Each fact has one home. The other places keep one sentence and a link.

| Topic | Home |
|---|---|
| Bundle, manifest, signature, agent pull and checks, release paths, pin, rollback, drift | `delivery.html` |
| Commands, flags, settings, exit codes, terminal examples | `cli.html` |
| Problem codes (code, status, when, hint) | `api.html#errors` |
| Event types | `api.html#events` |
| ETag, If-Match, preconditions | `api.html#concurrency` |
| Idempotency-Key | `allocation.html#idempotency` |
| Roles, permissions, bindings, scopes, issuers, tokens, audit, change requests | `access.html` |
| Object definitions, fields, relations, DDL | `model.html` (behaviour lives in the chapter) |
| Import findings `ona.*` and their fix rules | `map-ona.html#problems` |
| Parallel run (normalise, diff, exit criterion) | `migration.html#parallel` |
| Story data | `index.html#the-example` |
| Story moment, UI page template, shell, common parts | `ui.html` |
| Help system, hints, help pane, assistant | `assistant.html` |
| Metrics and alerts | `operations.html#observability` |
| TLS, secrets, key rotation | `operations.html#security` |

Pick the form by the type of information:

| Type of information | Form |
|---|---|
| Steps that a user does in order | Numbered list |
| Cases: condition, result, code | Decision table |
| Items with two or more attributes | Table |
| Three or more parallel rules | Bullet list |
| Term and definition | One sentence; the glossary has the entry |
| Structure | Diagram |
| States and transitions | State diagram and a transition table |
| A process in time where records change | Step explainer |
| What a page or a terminal shows | Screenshot or `pre.term` |
| A concept, a reason, a trade-off | Short prose; a reason in a `why` callout |
| A rule that other parts depend on | `rule` callout |

Remove this bloat:

- The same fact twice on one page. The lede gives the scope in 1 to 3
  sentences, the key points give 4 to 7 decisions, the body does not repeat
  them.
- Meta text: "This section specifies", "The table shows", "see above".
- Rule walls: 5 or more rules in one paragraph. Add a new case as a table row.
- More than one link to the same target in one section.
- A "why" callout that repeats the text before it.

`tools/site/textcheck.py` checks the limits: a sentence has at most 25
words (20 in a step), a paragraph at most 60 words and 6 sentences, a table
cell at most 40 words. A sentence with 40 % code or an enumeration of names
is exempt. A heading comes every 150 to 400 words of running text, with no
level jump. Change the form only when the type of information changes.

## 3. Diagrams and explainers

- Each chapter has diagrams: the requester reads pictures first. Prefer a
  diagram to a long paragraph for a structure, a flow or a sequence.
- Use `figure.diagram` with inline SVG and the diagram classes (`box`, `edge`,
  `t` and their variants; markers `#arrow`, `#arrow-accent`, `#arrow-muted`).
- No colour values in the SVG. The classes give light and dark mode.
- Add a `<figcaption>`. The build links glossary words in the caption, not in
  the SVG text.
- For a flow that is hard to follow in one picture (allocation with a retry,
  a login, the parallel run), use a step explainer:
  `figure.diagram.wide.explainer`, `data-f="0-3"` or `data-f="1,4"` on the SVG
  elements of some frames, and `<script type="application/json"
  class="steps">["frame 0 text", ...]</script>` before the `figcaption`.
  `docs/assets/site.js` plays it with step buttons and the arrow keys.
- Render each new diagram (Playwright, light and dark) and fix overlaps and
  text outside its box.

## 3a. The story data

All chapters, mockups, API examples and help texts use one data story:
`example.org`, the users `d.klein`, `a.berger`, `m.huber`, `s.yildiz`, the VRFs
`global`, `hpc-fabric`, `oob`, `os-provider`, the subnet `10.20.4.0/22`
kestrel-compute, the host `cn-004.kestrel.example.org` in Rack A01, the import
run `imp-20261104-0912` with 214 findings. The home page `docs/index.html`
("The example in this record") lists the key facts. Reuse an existing value
before you invent a new one, and search the record for a value before you
change it (`grep -rn '10.20.4.44' docs/`).

## 4. Build and check

```sh
mise run docs              # python3 tools/site/build.py --strict --out _site
mise run docs:check        # python3 tools/site/glossary.py mockups --check
mise run docs:text         # python3 tools/site/textcheck.py
python3 tools/site/glossary.py report            # links per term and repo
```

- `--strict` must say `OK`: no broken link, no missing anchor, no page outside
  `nav.json`, no external resource, no class outside the contract.
- `textcheck` must say `0 findings`. Fix the text, not the limit (section 2a).
- `mockups --check` must say `0 files to change`. If not, use the skill
  `docs-mockups`.
- After a change of the text, look at `report KEY` for each new or changed
  glossary word and for each project name in the changed sections. Each link
  must have the glossary meaning.

## 5. Look at the result

Open the changed pages in a browser (`mise run docs:serve`) or
take screenshots with Playwright. Look at:

- light and dark mode (`prefers-color-scheme` and the theme button);
- a phone width (390 CSS px): no horizontal scroll, the tables scroll in their
  box;
- the hover card on two or three term links (domain icon, colour, definition);
- the glossary page `design/glossary.html` when the glossary changed: the
  filter, the domain buttons, a link to `#<id>`;
- print preview when you changed the layout.

## 6. Mockups and screenshots

A change to a mockup, to `docs/design/mockups/assets/` or to the glossary can
change the screenshots. Use the skill `docs-mockups`. Commit the new `.webp`
files in the same pull request.

## 7. Commit

- Conventional Commits (`docs(design): ...`, `docs(mockups): ...`,
  `feat(site): ...`, `fix(site): ...`), with a short body of bullet points.
- No temporal or local context in a commit (no session links, no "as
  discussed", no dates of the work).
- One logical change per commit: for example the generator change, the glossary
  data and the page text in separate commits when each one is complete.
- The generated mockup links and the screenshots go into the commit of the
  change that caused them.
