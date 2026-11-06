# bembel

`bembel` is an API-first source of truth for IP addresses, DNS and DHCP. It
replaces OpenNetAdmin at a research and HPC organisation. It models IPv4 and
IPv6, VRFs, Ethernet, RoCEv2 and InfiniBand fabrics. It exports BIND zones,
`dhcpd.conf` and OpenSM partitions, shows the racks from FNT Command, and
integrates with OpenStack, Kubernetes and libvirt hypervisors. Access control
uses OIDC with roles and scopes.

The name is the Hessian stoneware jug that holds the apple wine and pours it
out, as an IPAM holds the address space and gives out addresses.

Status: design. No code yet. License: [Apache-2.0](LICENSE).

## Design record

Read the design record at **<https://dennisklein.github.io/bembel/>**.
The source is in [`docs/`](docs/index.html):

| Part | Chapters |
|---|---|
| I Foundations | [Decision](docs/design/decision.html) · [Architecture and stack](docs/design/architecture.html) · [Core model](docs/design/model.html) · [Glossary](docs/design/glossary.html) |
| II How it works | [Allocation](docs/design/allocation.html) · [DNS](docs/design/dns.html) · [DHCP](docs/design/dhcp.html) · [Fabrics](docs/design/fabrics.html) · [Exports and delivery](docs/design/delivery.html) · [Routing and firewall](docs/design/routing.html) · [Access control](docs/design/access.html) · [Assets](docs/design/assets.html) |
| III Programs and terminals | [REST API](docs/design/api.html) · [CLI](docs/design/cli.html) |
| IV Web UI | [Web UI](docs/design/ui.html) · [Addressing pages](docs/design/ui-addr.html) · [DNS and DHCP pages](docs/design/ui-dns.html) · [Asset pages](docs/design/ui-assets.html) · [Access and integration pages](docs/design/ui-access.html) · [Assistant and help](docs/design/assistant.html) · [Mockup gallery](docs/design/mockups/index.html) |
| V Integrations | [Virtual machines](docs/design/vms.html) · [OpenStack](docs/design/openstack.html) · [Kubernetes](docs/design/kubernetes.html) · [VPN and Wi-Fi](docs/design/vpn-wifi.html) · [NetBox](docs/design/map-netbox.html) |
| VI Migration and operations | [OpenNetAdmin mapping](docs/design/map-ona.html) · [Migration from ONA](docs/design/migration.html) · [Operations](docs/design/operations.html) · [Open questions](docs/design/questions.html) |

The OpenAPI sketch is in [`docs/design/api/openapi.yaml`](docs/design/api/openapi.yaml).

## Tools

[mise](https://mise.jdx.dev/) pins the tools and runs the tasks:

```sh
mise install                # Python and Node in the versions of mise.toml
mise tasks                  # list the tasks
```

## Build the docs site

The site generator needs only Python 3 (standard library).

```sh
mise run docs               # python3 tools/site/build.py --strict --out _site
mise run docs:serve         # open http://localhost:8000/
```

`--strict` fails on a broken link, a missing anchor, a page that is not in
`tools/site/nav.json`, an external resource and a class outside the authoring
contract.

The [docs workflow](.github/workflows/docs.yml) builds the site for each pull
request. A push to `main` also deploys it to GitHub Pages. In the repository
settings, *Pages → Source* must be *GitHub Actions*.

### Screenshots

The screenshots in `docs/design/img/` come from the mockups. Make them again
after a change to a mockup:

```sh
mise run docs:shots                       # all pages
node tools/site/shots.mjs prefix rack     # some pages
```

This needs Node with Playwright and Chromium, and Python 3 with Pillow (for
WebP).

### Write a page

A page in `docs/` is an HTML fragment: one `<h1>`, then the content. The
generator adds the frame (header, chapter list, "On this page", search,
previous and next). The chapter list and the fixed anchors are in
`tools/site/nav.json`. Use the classes of the authoring contract
(`CONTRACT_CLASSES` in `tools/site/build.py`), for example:

- `p.lede` for the first paragraph, `ul.keypoints` for the key points;
- `aside.callout` with `note`, `rule`, `why`, `warn` or `tip`;
- `pre.term` for terminal output, `pre > code.language-*` for code;
- `figure.diagram` for an inline SVG diagram (classes `box`, `edge`, `t` and
  their variants; markers `#arrow`, `#arrow-accent`, `#arrow-muted`);
- `figure.diagram.wide.explainer` for a step explainer: `data-f` frames on
  the SVG elements and a `script.steps` JSON list of frame texts;
- `figure.shot` for a screenshot of a mockup.

Do not use inline styles or colours. The site CSS gives light and dark mode.
Write in ASD-STE100 (Simplified Technical English). Use the story data of
the home page for all examples.

Keep the text compact: one home for each fact, the form that fits the type
of information, and the limits of the text image (the skill `docs-steward`,
section 2a). The check runs in CI:

```sh
mise run docs:text          # python3 tools/site/textcheck.py
```

### Glossary

The project words are in `docs/assets/glossary-data.js`: the word, its forms,
its domain (addressing, DNS, DHCP, assets, access, integrations) and its
definition. The build makes `design/glossary.html` from it. In each section of
a chapter, it links the first use of each word to its entry (dotted underline,
a hover card with the domain icon and colour). Headings, code, links,
definitions (`<dfn>`) and table heads stay plain. Put text in
`<span class="no-gl">` to keep it plain.

The web UI mockups have the same links. Make them again after a change to the
glossary or to a mockup, then make the screenshots again:

```sh
mise run docs:glossary      # python3 tools/site/glossary.py mockups
```

The other projects that the text names (a tool such as `NetBox` or
`external-dns`, a repository such as `dennisklein/rackplanner`) are in
`tools/site/projects.json`. The build links the first use of each one in a
section to its GitHub repository.

To see each link of a word in context, build the site, then:

```sh
python3 tools/site/glossary.py report             # links per term and repo
python3 tools/site/glossary.py report claim netbox-community/netbox
```

### Skills for agents

`.claude/skills/` has the doc steward skills: `docs-steward` (the checklist
for each change), `docs-glossary` (project words and project links) and
`docs-mockups` (mockups and screenshots).
