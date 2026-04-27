---
"@opentf/std": minor
---

🛡️ Security Fixes Implemented:

Performed a security audit of all object-manipulation utilities and implemented strict key filtering to block access to sensitive keys (__proto__, constructor, prototype). The following utilities are now secured:

set.ts: Prevented path-based pollution of the global prototype.
unset.ts: Blocked the ability to delete properties from the global prototype (preventing DoS attacks).
merge.ts & mergeAll.ts: Added guards to prevent deep-merging from traversing into internal object properties.
clone.ts: Ensured that cloning an object cannot inadvertently modify the prototype of the new instance.
mapKeys.ts: Protected against transformation mappers that return sensitive key names.