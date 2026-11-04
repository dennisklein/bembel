// The glossary of the bembel design record: the one source of the project words.
// tools/site/build.py reads it to make design/glossary.html and to link the first use
// of each term in each section. The mockups and site.js read it for the hover card.
// Keep the part after "=" strict JSON: double quotes, no trailing commas, no comments.
//   id      anchor on the glossary page (design/glossary.html#ID)
//   kind    noun, verb, or noun and verb
//   domain  key of "domains"; gives the icon and the colour
//   forms   the exact words that link to the term (case-sensitive; a capital first
//           letter also matches). The longest form wins.
//   see     the chapter section that explains the term, relative to design/
//   def     one sentence or two, ASD-STE100; inline HTML (code) only
//   only_after, not_after, not_before (optional): Python regular expressions on the text before and after a form in the same text node.
//           A form links only when the text before matches only_after, the text
//           before does not match not_after and the text after does not match not_before.
//           They keep the English verb ("run the command", "is not set") plain.
window.BEMBEL_GLOSSARY = {
 "domains": {
  "addr": {
   "name": "Addressing",
   "icon": "M6.5 1.8h3v3h-3Z M2 11.2h3v3H2Z M11 11.2h3v3h-3Z M8 4.8v3.2 M3.5 11.2V8h9v3.2"
  },
  "dns": {
   "name": "DNS",
   "icon": "M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8Z M1.8 8h12.4 M8 1.8C6 3.8 5.4 5.8 5.4 8S6 12.2 8 14.2 M8 1.8c2 2 2.6 4 2.6 6.2S10 12.2 8 14.2"
  },
  "dhcp": {
   "name": "DHCP",
   "icon": "M2.2 4.6h8.4l3.2 3.4-3.2 3.4H2.2Z M5 8h3.6"
  },
  "assets": {
   "name": "Assets",
   "icon": "M3.6 1.8h8.8v12.4H3.6Z M3.6 5h8.8 M3.6 8.2h8.8 M3.6 11.4h8.8 M5.6 3.4h1.2 M5.6 6.6h1.2 M5.6 9.8h1.2"
  },
  "access": {
   "name": "Access",
   "icon": "M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6Z M5.9 8l1.5 1.5 2.8-3"
  },
  "integ": {
   "name": "Integrations",
   "icon": "M2 5h9 M8.6 2.6 11 5 8.6 7.4 M14 11H5 M7.4 8.6 5 11l2.4 2.4"
  }
 },
 "terms": [
  {"id": "address", "term": "address", "kind": "noun", "domain": "addr", "forms": ["IP address", "IP addresses", "address", "addresses"], "see": "model.html#addressing", "def": "One IP address in a subnet, with a status, a DNS name and an optional interface.", "not_after": "(?:MAC|hardware|e-?mail|IPoIB|web|link-local|mail|postal)\\s$"},
  {"id": "address-group", "term": "address group", "kind": "noun", "domain": "addr", "forms": ["address group", "address groups"], "see": "routing.html#address-groups", "def": "A named dynamic set of addresses and prefixes, defined by a filter. Firewalls read it as a feed."},
  {"id": "advisory-button", "term": "advisory button", "kind": "noun", "domain": "integ", "forms": ["advisory button", "advisory buttons"], "see": "assistant.html#advisories", "def": "A fixed assistant prompt on a page with a known tool plan, for example Explain this finding."},
  {"id": "allocate", "term": "allocate", "kind": "verb", "domain": "addr", "forms": ["allocate", "allocates", "allocated", "allocating"], "see": "allocation.html#allocate", "def": "To give the next free address or prefix of a parent, in one atomic call.", "not_after": "status\\s$|`$"},
  {"id": "allocation", "term": "allocation", "kind": "noun", "domain": "addr", "forms": ["allocation", "allocations"], "see": "allocation.html#allocate", "def": "The result of an allocate call: an address or a prefix that the call gave."},
  {"id": "approve", "term": "approve", "kind": "verb", "domain": "access", "forms": ["approve", "approves", "approved", "approval", "approvals"], "see": "access.html#changes", "def": "To let a change request run. The approver is not the requester."},
  {"id": "asn", "term": "ASN", "kind": "noun", "domain": "addr", "forms": ["ASN", "ASNs"], "see": "routing.html#asn", "def": "An autonomous system number for BGP, from an ASN range, with an owner."},
  {"id": "asset-link", "term": "asset link", "kind": "noun", "domain": "assets", "forms": ["asset link", "asset links"], "see": "assets.html#matching", "def": "The link of a host to a device, or of an interface to a port."},
  {"id": "asset-mirror", "term": "asset mirror", "kind": "noun", "domain": "assets", "forms": ["asset mirror"], "see": "assets.html#scope", "def": "The read-only copy of the locations, racks, devices and ports of FNT Command in bembel."},
  {"id": "assistant", "term": "assistant", "kind": "noun", "domain": "integ", "forms": ["assistant"], "see": "assistant.html#assistant", "def": "The chat panel of the web UI on a local LLM. It reads data through tools with the permissions of the user and proposes drafts."},
  {"id": "audit-event", "term": "audit event", "kind": "noun", "domain": "access", "forms": ["audit event", "audit events", "audit log"], "see": "access.html#audit", "def": "An append-only record of one change or one denied request, with the subject and the binding."},
  {"id": "bff-session", "term": "BFF session", "kind": "noun", "domain": "access", "forms": ["BFF session", "BFF sessions"], "see": "access.html#login-browser", "def": "The login of the web UI: the server keeps the OIDC tokens and gives the browser one HttpOnly cookie."},
  {"id": "binding", "term": "binding", "kind": "noun", "domain": "access", "forms": ["binding", "bindings"], "see": "access.html#bindings", "def": "A subject, a role and a scope: the subject has the permissions of the role in the scope."},
  {"id": "bundle", "term": "bundle", "kind": "noun", "domain": "integ", "forms": ["bundle", "bundles"], "see": "dns.html#delivery", "def": "The signed, immutable set of export files for one server, with a manifest, an id and an ETag. The agent pulls it."},
  {"id": "change-request", "term": "change request", "kind": "noun", "domain": "access", "forms": ["change request", "change requests"], "see": "access.html#changes", "def": "A held dangerous change. A second user with the permission change-request:approve in scope approves it."},
  {"id": "claim", "term": "claim", "kind": "noun", "domain": "addr", "forms": ["claim", "claims"], "see": "allocation.html#claims", "def": "A temporary hold on an address with an expiry. The caller confirms it, or the reaper releases it.", "not_after": "(?:groups?|OIDC|JWT|token|sub|iss|aud|email|IPAddress|Address)\\s$", "not_before": "^\\s+(?:mapping|name|value)\\b|^Ref"},
  {"id": "client-identifier", "term": "client identifier", "kind": "noun", "domain": "dhcp", "forms": ["client identifier", "client identifiers"], "see": "dhcp.html#ipoib", "def": "The DHCP option 61 value that a server matches instead of a MAC, for an IPoIB interface."},
  {"id": "compat-mode", "term": "compat mode", "kind": "noun", "domain": "integ", "forms": ["compat mode"], "see": "dns.html#compat", "def": "The export mode that writes the same bytes as ONA, for the parallel run."},
  {"id": "container", "term": "container", "kind": "noun", "domain": "addr", "forms": ["container prefix", "container prefixes", "container", "containers"], "see": "model.html#addressing", "def": "A prefix that holds only other prefixes, for example an aggregate or the block of a site.", "not_after": "(?:Docker|OCI|Kubernetes|init)\\s$"},
  {"id": "custom-attribute", "term": "custom attribute", "kind": "noun", "domain": "integ", "forms": ["custom attribute", "custom attributes"], "see": "model.html#common", "def": "A typed field that an admin declares for one object kind."},
  {"id": "cutover", "term": "cutover", "kind": "noun", "domain": "integ", "forms": ["cutover"], "see": "migration.html#cutover", "def": "The step in which the DNS and DHCP servers start to read the exports of bembel, not of ONA."},
  {"id": "derived-record", "term": "derived record", "kind": "noun", "domain": "dns", "forms": ["derived record", "derived records"], "see": "dns.html#derived", "def": "An A, AAAA or PTR record that bembel makes from an address. It changes only through the address."},
  {"id": "device", "term": "device", "kind": "noun", "domain": "assets", "forms": ["device", "devices"], "see": "assets.html#entities", "def": "A physical item in a rack, from FNT Command: position, height in U, face, model, serial.", "not_after": "(?:block|character|the\\s+OAuth|authorization)\\s$", "not_before": "^\\s+(?:grant|code|flow|authorization)\\b"},
  {"id": "dhcp-option", "term": "DHCP option", "kind": "noun", "domain": "dhcp", "forms": ["DHCP option", "DHCP options"], "see": "dhcp.html#options", "def": "A code and a value that the DHCP server sends, at global, server, scope or host level."},
  {"id": "dhcp-pool", "term": "DHCP pool", "kind": "noun", "domain": "dhcp", "forms": ["DHCP pool", "DHCP pools", "dynamic pool", "dynamic pools"], "see": "dhcp.html#pools", "def": "A range with the purpose dhcp-pool. The DHCP server gives its addresses dynamically."},
  {"id": "dhcp-scope", "term": "DHCP scope", "kind": "noun", "domain": "dhcp", "forms": ["DHCP scope", "DHCP scopes"], "see": "dhcp.html#scopes", "def": "The DHCP settings of one subnet: on or off, servers, options and the failover pair."},
  {"id": "dhcp-server", "term": "DHCP server", "kind": "noun", "domain": "dhcp", "forms": ["DHCP server", "DHCP servers"], "see": "dhcp.html#delivery", "def": "A delivery target of the dhcpd export, for example dhcp1.example.org."},
  {"id": "dns-server", "term": "DNS server", "kind": "noun", "domain": "dns", "forms": ["DNS server", "DNS servers", "name server", "name servers"], "see": "dns.html#delivery", "def": "A delivery target of the BIND export, for example ns1.example.org."},
  {"id": "dns-view", "term": "DNS view", "kind": "noun", "domain": "dns", "forms": ["DNS view", "DNS views"], "see": "dns.html#views", "def": "A split-horizon view, for example internal or external. A zone and its records belong to views."},
  {"id": "draft", "term": "draft", "kind": "noun", "domain": "integ", "forms": ["draft", "drafts"], "see": "assistant.html#drafts", "def": "A change set that the assistant proposes. A user reviews it and applies it with the normal API call."},
  {"id": "dual-stack", "term": "dual stack", "kind": "noun", "domain": "addr", "forms": ["dual stack", "dual-stack"], "see": "fabrics.html#dual-stack", "def": "A network with an IPv4 subnet and an IPv6 subnet on the same VLAN or partition."},
  {"id": "elid", "term": "ELID", "kind": "noun", "domain": "assets", "forms": ["ELID", "ELIDs"], "see": "assets.html#fnt", "def": "The numeric element id of an object in FNT Command. bembel keeps it as the external ref."},
  {"id": "event", "term": "event", "kind": "noun", "domain": "integ", "forms": ["event", "events"], "see": "api.html#events", "def": "A CloudEvents record of one change. Webhooks and the event stream deliver events.", "not_after": "(?:audit|libvirt|hook)\\s$"},
  {"id": "expand-contract", "term": "expand and contract", "kind": "noun", "domain": "integ", "forms": ["expand and contract", "expand-and-contract"], "see": "operations.html#upgrades", "def": "A schema change in two releases, so that old and new pods run together during an upgrade."},
  {"id": "export", "term": "export", "kind": "noun", "domain": "integ", "forms": ["export", "exports"], "see": "dns.html#export", "def": "A set of generated config files for one external service and target: BIND, ISC dhcpd, OpenSM, a prefix list or a feed.", "not_before": "^\\s+(?:route|target)", "not_after": "(?:import\\s+and|import/)\\s?$"},
  {"id": "external-ref", "term": "external ref", "kind": "noun", "domain": "integ", "forms": ["external ref", "external refs"], "see": "model.html#ownership", "def": "The id of an object in its source system, for example an FNT ELID or a Neutron port UUID."},
  {"id": "fabric", "term": "fabric", "kind": "noun", "domain": "addr", "forms": ["fabric", "fabrics"], "see": "fabrics.html#kinds", "def": "The L2 technology domain of a subnet: ethernet, ethernet-roce or infiniband."},
  {"id": "failover-pair", "term": "failover pair", "kind": "noun", "domain": "dhcp", "forms": ["failover pair", "failover pairs"], "see": "dhcp.html#failover", "def": "Two DHCP servers, primary and secondary, that share the pools of a scope."},
  {"id": "feed", "term": "feed", "kind": "noun", "domain": "integ", "forms": ["feed", "feeds"], "see": "routing.html#feeds", "def": "An export that a device pulls over HTTPS, for example an address group as a plain list for a firewall."},
  {"id": "finding", "term": "finding", "kind": "noun", "domain": "integ", "forms": ["finding", "findings"], "see": "migration.html#findings", "def": "A data problem that an import run or a sync finds, for example an orphan record or a duplicate MAC."},
  {"id": "help-pane", "term": "help pane", "kind": "noun", "domain": "integ", "forms": ["help pane"], "see": "assistant.html#help", "def": "The right pane of the web UI with the help for this page, its words, its tasks and the keys."},
  {"id": "host", "term": "host", "kind": "noun", "domain": "addr", "forms": ["host", "hosts"], "see": "model.html#hosts", "def": "A named logical system: a server, a switch, a VM, a BMC or an appliance. It has interfaces.", "not_after": "(?:local|remote|virtual|bastion)\\s$", "not_before": "^\\s*(?:name|names|header|key)\\b"},
  {"id": "hypervisor", "term": "hypervisor", "kind": "noun", "domain": "addr", "forms": ["hypervisor", "hypervisors"], "see": "vms.html#model", "def": "A host of kind hypervisor. VMs have a runs-on link to it."},
  {"id": "ib-partition", "term": "IB partition", "kind": "noun", "domain": "addr", "forms": ["IB partition", "IB partitions", "partition", "partitions"], "see": "fabrics.html#partitions", "def": "An InfiniBand partition with a P_Key. In an IB fabric, it has the function of a VLAN.", "not_after": "(?:disk|database|table|monthly)\\s$"},
  {"id": "idempotency-key", "term": "idempotency key", "kind": "noun", "domain": "integ", "forms": ["idempotency key", "idempotency keys"], "see": "api.html#idempotency", "def": "A header on a write call. Two calls with the same key give the same answer, and the change runs once."},
  {"id": "interface", "term": "interface", "kind": "noun", "domain": "addr", "forms": ["interface", "interfaces"], "see": "model.html#hosts", "def": "A network port of a host, with a MAC or a port GUID. It holds zero or more addresses.", "not_after": "(?:user|driver|web|programming|command-line|IPAM|plugin|Python|Go|REST|CLI|Pool)\\s$", "not_before": "^\\s+(?:of|to|for)\\s+(?:the\\s+)?(?:Neutron|driver|plugin)"},
  {"id": "issuer", "term": "issuer", "kind": "noun", "domain": "access", "forms": ["trusted issuer", "trusted issuers", "issuer", "issuers"], "see": "access.html#issuers", "def": "An OIDC provider whose tokens bembel accepts, for example Keycloak or a Kubernetes cluster."},
  {"id": "known-difference", "term": "known difference", "kind": "noun", "domain": "integ", "forms": ["known difference", "known differences"], "see": "migration.html#known", "def": "A rule that explains an intended difference between the ONA files and the bembel files in the parallel run."},
  {"id": "lease", "term": "lease", "kind": "noun", "domain": "dhcp", "forms": ["lease", "leases"], "see": "dhcp.html#leases", "def": "A dynamic address that a DHCP server gave. bembel reads leases to show last seen data."},
  {"id": "libvirt-hook", "term": "libvirt hook", "kind": "noun", "domain": "integ", "forms": ["libvirt hook", "libvirt hooks"], "see": "vms.html#hook", "def": "The qemu hook script on a libvirt hypervisor that confirms or releases the claim of a VM."},
  {"id": "managed-by", "term": "managed by", "kind": "noun", "domain": "integ", "forms": ["managed by"], "see": "model.html#ownership", "def": "The integration that owns an object. Users cannot edit an object that an integration manages."},
  {"id": "manual-record", "term": "manual record", "kind": "noun", "domain": "dns", "forms": ["manual record", "manual records"], "see": "dns.html#records", "def": "A record that a user or a service edits directly, for example CNAME, MX, SRV or TXT."},
  {"id": "map-file", "term": "map file", "kind": "noun", "domain": "integ", "forms": ["map file", "map files"], "see": "migration.html#mapfile", "def": "A YAML file under version control with the rules that ONA cannot hold, such as the VRF of a subnet, and the answers to findings."},
  {"id": "ona-import", "term": "ONA import", "kind": "noun", "domain": "integ", "forms": ["ONA import", "ONA imports", "import run", "import runs"], "see": "migration.html#import", "def": "A run that reads an ONA database dump and writes the objects to bembel, with findings."},
  {"id": "outbox", "term": "outbox", "kind": "noun", "domain": "integ", "forms": ["outbox"], "see": "api.html#events", "def": "The table that stores each event in the transaction of its change. A worker sends the events to webhooks and the event stream."},
  {"id": "parallel-run", "term": "parallel run", "kind": "noun", "domain": "integ", "forms": ["parallel run", "parallel runs"], "see": "migration.html#parallel", "def": "The period in which ONA and bembel both make exports and a nightly diff compares them."},
  {"id": "permission", "term": "permission", "kind": "noun", "domain": "access", "forms": ["permission", "permissions"], "see": "access.html#permissions", "def": "One action on one kind, for example prefix:allocate or record:create."},
  {"id": "token", "term": "personal access token", "kind": "noun", "domain": "access", "forms": ["personal access token", "personal access tokens", "bembel token", "bembel tokens"], "see": "access.html#tokens", "def": "A secret for scripts. It expires and it has only a subset of the permissions of its owner."},
  {"id": "port", "term": "port", "kind": "noun", "domain": "assets", "forms": ["port", "ports"], "see": "assets.html#entities", "def": "A physical port of a device, from FNT Command, with a name and a MAC or GUID.", "not_after": "(?:TCP|UDP|HTTP|HTTPS|listen|IB|InfiniBand|switch)\\s$", "not_before": "^\\s*(?:\\d|GUID|number|mapping)"},
  {"id": "guid", "term": "port GUID", "kind": "noun", "domain": "addr", "forms": ["port GUID", "port GUIDs", "GUID", "GUIDs"], "see": "fabrics.html#guids", "def": "The 64-bit identifier of an InfiniBand port. It identifies an IB interface as a MAC identifies an Ethernet interface."},
  {"id": "prefix", "term": "prefix", "kind": "noun", "domain": "addr", "forms": ["prefix", "prefixes"], "see": "model.html#addressing", "def": "A CIDR block in a VRF. Prefixes make a tree by containment. A prefix is a container or a subnet.", "not_before": "^\\s+(?:list|lists)\\b"},
  {"id": "prefix-list", "term": "prefix list", "kind": "noun", "domain": "addr", "forms": ["prefix list", "prefix lists"], "see": "routing.html#prefix-lists", "def": "A generated list of prefixes for a router, from the prefix tree and its tags."},
  {"id": "prefix-pool", "term": "prefix pool", "kind": "noun", "domain": "addr", "forms": ["prefix pool", "prefix pools"], "see": "allocation.html#prefix-allocate", "def": "A container prefix from which callers allocate child prefixes."},
  {"id": "problem-type", "term": "problem type", "kind": "noun", "domain": "integ", "forms": ["problem type", "problem types"], "see": "api.html#errors", "def": "The stable code of an API error, for example <code>prefix.exhausted</code>, in an <code>application/problem+json</code> answer."},
  {"id": "qos-profile", "term": "QoS profile", "kind": "noun", "domain": "addr", "forms": ["QoS profile", "QoS profiles"], "see": "fabrics.html#roce", "def": "The lossless settings of a RoCEv2 fabric: DSCP, PFC priority and ECN."},
  {"id": "rack", "term": "rack", "kind": "noun", "domain": "assets", "forms": ["rack", "racks"], "see": "assets.html#entities", "def": "A cabinet with a height in U, in a row of a room."},
  {"id": "rail", "term": "rail", "kind": "noun", "domain": "addr", "forms": ["rail", "rails"], "see": "fabrics.html#rails", "def": "One of the parallel networks of a rail-optimised GPU fabric. A rail has its own subnet and VLAN."},
  {"id": "range", "term": "range", "kind": "noun", "domain": "addr", "forms": ["range", "ranges"], "see": "model.html#addressing", "def": "A contiguous span of addresses in a subnet with a purpose, for example dhcp-pool or reserved.", "not_before": "^\\s+of\\b", "not_after": "(?:ASN|VID|date|time|port)\\s$"},
  {"id": "reaper", "term": "reaper", "kind": "noun", "domain": "addr", "forms": ["reaper"], "see": "allocation.html#reaper", "def": "A background worker that releases expired claims, and deprecated addresses after their grace time."},
  {"id": "record", "term": "record", "kind": "noun", "domain": "dns", "forms": ["DNS record", "DNS records", "record", "records"], "see": "dns.html#records", "def": "A DNS resource record: name, type, TTL and data, in a view.", "not_after": "(?:audit|sync|history|deployment|import|change|event|the\\s+audit)\\s$", "not_before": "^\\s+(?:of|the)\\b"},
  {"id": "reservation", "term": "reservation", "kind": "noun", "domain": "dhcp", "forms": ["reservation", "reservations", "fixed address", "fixed addresses"], "see": "dhcp.html#reservations", "def": "An address that the DHCP server always gives to one MAC or client identifier."},
  {"id": "restart-ticket", "term": "restart ticket", "kind": "noun", "domain": "dhcp", "forms": ["restart ticket", "restart tickets"], "see": "dhcp.html#delivery", "def": "A permit that lets the agent of one failover peer restart dhcpd. bembel gives one ticket at a time for each pair."},
  {"id": "reverse-zone", "term": "reverse zone", "kind": "noun", "domain": "dns", "forms": ["reverse zone", "reverse zones"], "see": "dns.html#reverse", "def": "An in-addr.arpa or ip6.arpa zone. bembel computes it from the subnets."},
  {"id": "review-list", "term": "review list", "kind": "noun", "domain": "assets", "forms": ["review list"], "see": "assets.html#matching", "def": "The list of ambiguous matches between hosts and devices that a user must decide."},
  {"id": "role", "term": "role", "kind": "noun", "domain": "access", "forms": ["role", "roles"], "see": "access.html#roles", "def": "A named set of permissions, for example allocator or dns-editor.", "not_after": "(?:Keycloak|realm|client|IdP|host|the\\s+IdP)\\s$"},
  {"id": "route-target", "term": "route target", "kind": "noun", "domain": "addr", "forms": ["route target", "route targets", "route distinguisher", "route distinguishers"], "see": "routing.html#vrf-rt", "def": "The BGP values of a VRF: the route distinguisher and the import and export route targets."},
  {"id": "row-hash", "term": "row hash", "kind": "noun", "domain": "integ", "forms": ["row hash", "row hashes"], "see": "migration.html#idempotent", "def": "The hash of the ONA rows that made one object. The import compares it to decide create, update or no change."},
  {"id": "scope", "term": "scope", "kind": "noun", "domain": "access", "forms": ["scope", "scopes"], "see": "access.html#scopes", "def": "The objects to which a binding applies: global, a VRF, a prefix subtree, a zone subtree, a site, a team or a tag.", "not_after": "(?:DHCP|OAuth|token|the\\s+OAuth|v1|project)\\s$"},
  {"id": "service", "term": "service", "kind": "noun", "domain": "access", "forms": ["service identity", "service identities"], "see": "access.html#subjects", "def": "A machine identity, for example a Kubernetes service account or a CI job, with issuer and subject."},
  {"id": "shadow-mode", "term": "shadow mode", "kind": "noun", "domain": "integ", "forms": ["shadow mode", "hold mode"], "see": "migration.html#agent", "def": "A mode of the bembel-agent that pulls and checks bundles but does not activate them."},
  {"id": "site", "term": "site", "kind": "noun", "domain": "assets", "forms": ["site", "sites"], "see": "assets.html#entities", "def": "The top of the location tree: a campus or a data centre. Prefixes and VLAN domains can have a site.", "not_after": "(?:docs|web|Pages|GitHub|the\\s+docs)\\s$"},
  {"id": "static-route", "term": "static route", "kind": "noun", "domain": "addr", "forms": ["static route", "static routes"], "see": "routing.html#routes", "def": "A route in a VRF: a destination prefix and a next-hop address, with an owner."},
  {"id": "subject", "term": "subject", "kind": "noun", "domain": "access", "forms": ["subject", "subjects"], "see": "access.html#subjects", "def": "A user, a group or a service that a binding names."},
  {"id": "subnet", "term": "subnet", "kind": "noun", "domain": "addr", "forms": ["subnet", "subnets"], "see": "model.html#addressing", "def": "A prefix that is an L3 network. It holds addresses and has a gateway, a VLAN or partition, and DHCP and DNS settings."},
  {"id": "sync", "term": "sync", "kind": "noun and verb", "domain": "integ", "forms": ["sync", "syncs"], "see": "model.html#ownership", "def": "A job that reads a source system and updates the objects of that source in bembel.", "not_before": "^\\s+(?:with)\\b"},
  {"id": "tag", "term": "tag", "kind": "noun", "domain": "integ", "forms": ["tag", "tags"], "see": "model.html#common", "def": "A key=value label on any object. Filters, scopes and address groups use tags.", "not_after": "(?:git|image|HTML|release|Docker)\\s$"},
  {"id": "team", "term": "team", "kind": "noun", "domain": "access", "forms": ["team", "teams"], "see": "model.html#common", "def": "An owner of objects. It maps to a group of the IdP, for example hpc-ops."},
  {"id": "tool", "term": "tool", "kind": "noun", "domain": "integ", "forms": ["assistant tool", "assistant tools"], "see": "assistant.html#tools", "def": "A read call of the API that the assistant can use, for example search or explain permission."},
  {"id": "bembel-agent", "term": "bembel-agent", "kind": "noun", "domain": "integ", "forms": ["bembel-agent"], "see": "vms.html#agent", "def": "The daemon on a hypervisor or a DNS or DHCP server. It reports VMs, or it pulls and installs exports."},
  {"id": "utilisation", "term": "utilisation", "kind": "noun", "domain": "addr", "forms": ["utilisation"], "see": "allocation.html#utilisation", "def": "The share of usable addresses of a subnet, or of the space of a container, that is in use."},
  {"id": "vlan", "term": "VLAN", "kind": "noun", "domain": "addr", "forms": ["VLAN", "VLANs"], "see": "fabrics.html#ethernet", "def": "An Ethernet broadcast domain with a VID from 1 to 4094, in a VLAN domain."},
  {"id": "vlan-domain", "term": "VLAN domain", "kind": "noun", "domain": "addr", "forms": ["VLAN domain", "VLAN domains"], "see": "fabrics.html#ethernet", "def": "The scope in which each VID is unique, for example one campus or one fabric."},
  {"id": "vm", "term": "VM", "kind": "noun", "domain": "addr", "forms": ["virtual machine", "virtual machines", "VM", "VMs"], "see": "vms.html#model", "def": "A host of kind vm. It runs on a hypervisor host."},
  {"id": "vrf", "term": "VRF", "kind": "noun", "domain": "addr", "forms": ["VRF", "VRFs"], "see": "model.html#addressing", "def": "An independent address space (a routing domain). A prefix is unique in its VRF. The default VRF is global."},
  {"id": "webhook", "term": "webhook", "kind": "noun", "domain": "integ", "forms": ["webhook", "webhooks"], "see": "api.html#webhooks", "def": "An HTTPS endpoint that receives the events of a filter.", "not_after": "(?:external-dns)\\s$"},
  {"id": "zone", "term": "zone", "kind": "noun", "domain": "dns", "forms": ["zone", "zones"], "see": "dns.html#zones", "def": "A DNS zone, forward or reverse, in one or more DNS views, with SOA and NS settings and an owner.", "not_after": "(?:time|availability|fire|security|network|FNT)\\s$"}
 ]
};
