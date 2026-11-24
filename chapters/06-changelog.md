# 6. Changelog

This chapter records revisions to the manual and provides contact details for
reporting issues or suggesting improvements.

## 6.1 Revision History

| Date | Revision | Reviewed and Edited By | Affiliation |
| --- | --- | --- | --- |
| 24 November 2026 | Updated the maintenance procedure to use the OSGi notification receiver and local application update flow. | Jiahao Yang | H2TRAIN, ULPGC |
| 28 October 2026 | Manual reviewed and edited. | Jiahao Yang | H2TRAIN, ULPGC |

### 24 November 2026

- Replaced the CommandService and remote script execution procedure with the
  `kura-receiver` OSGi component and Kapua device requests.
- Retained the dedicated `maintenance` account, MQTT transport, broker
  certificate, and maintenance cloud connection.
- Added instructions for installing the prebuilt JAR and granting the Cardia
  user read access to local update offers through operating system ACLs.
- Documented notification delivery, receiver acknowledgments, and the
  application-managed update process.
- Updated the system overview, glossary, references, and chapter navigation.
- Included Tailscale route acceptance and replaced the published broker
  password with an instruction to obtain it from the administrator.

## 6.2 Feedback and Contact

For issues or suggestions regarding this manual, contact the following email:

- **Email:** [jiahao.yang@ulpgc.es](mailto:jiahao.yang@ulpgc.es)

<div class="contributor-credit">
  <img src="../img/contributors/phalanxinho.png" alt="GitHub profile picture of PhalanXinho" width="64" height="64" loading="lazy">
  <div class="contributor-credit-details">
    <strong>Jiahao Yang</strong>
    <p>Reviewer and editor · H2TRAIN, ULPGC</p>
    <a href="https://github.com/PhalanXinho" target="_blank" rel="noopener noreferrer">GitHub · @PhalanXinho</a>
  </div>
</div>
