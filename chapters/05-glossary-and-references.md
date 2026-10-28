# 5. Glossary and Reference Material

This chapter explains the terminology used in the manual and brings together
the external documentation and deployment resources needed for installation,
network access, and cloud configuration.

## 5.1 Glossary

The definitions below describe terms in the context of the procedures in
chapters 2 through 4.

### 5.1.1 Hardware and Operating System

| Term | Definition |
| --- | --- |
| AArch64 (`aarch64`) | The 64-bit ARM architecture targeted by the Kura installer used in this manual. |
| Debian | The Linux distribution on which the Raspberry Pi OS release used in this implementation is based. |
| GPIO | General-Purpose Input/Output. The Raspberry Pi header used to interface with external electronics; it also includes power pins. |
| microSD card | Removable storage used here for the operating system, installed software, and device data. |
| RAM | Random-Access Memory. Working memory used by the operating system and running applications. The device described here has 4 GB. |
| Raspberry Pi 4 Model B | The single-board computer used as the Kura device in this implementation. |
| Raspberry Pi OS | The operating system used on the device, previously known as Raspbian. This procedure uses its 64-bit edition. |
| SoC | System on Chip. An integrated circuit combining the processor and other core hardware functions. |
| Trixie | The release name for Debian 13, used by the operating system and Adoptium repository configuration in this manual. |

### 5.1.2 Software Installation and Administration

| Term | Definition |
| --- | --- |
| APT (`apt`, `apt-get`) | Debian package-management tools used to refresh package lists, install software, and upgrade installed packages. |
| `curl` and `wget` | Command-line download tools. The procedures use them to retrieve installers, scripts, and a repository signing key. |
| DEB package (`.deb`) | A Debian software package. Kura is installed from a local file in this format. |
| Dependency | Software required by another application, such as the Java runtime needed to run Kura. |
| Eclipse Temurin | The OpenJDK distribution installed to provide Java 17 in this implementation. |
| GPG signing key | A cryptographic key used by APT to verify repository signatures and the authenticity of package information. |
| Java runtime and JDK | The runtime executes Java applications. The Java Development Kit (JDK) includes the runtime and development tools such as the `javac` compiler. |
| Package repository | A source of software packages and package information used by APT, such as the Adoptium repository. |
| Root and `sudo` | Root is the Linux administrator account. `sudo` allows an authorized user to run a command with elevated privileges. |
| SSH | Secure Shell. A protocol used to open an encrypted remote terminal session on the Raspberry Pi. |
| Working directory | The directory in which a command runs. The Command Service configuration uses `/tmp` for this purpose. |

### 5.1.3 Networking, Security, and VPN Access

| Term | Definition |
| --- | --- |
| Auth key | A Tailscale credential used to register a device on a tailnet without an interactive browser login on that device. It is separate from the Kapua broker credentials. |
| Authentication | Checking the identity of a user or device, for example by validating credentials or an email verification code. |
| Authorization | Determining which resources or operations an authenticated user or device may access, according to assigned roles and permissions. |
| Certificate and certificate authority (CA) | A certificate binds an identity to a public key. A CA signs certificates that clients may trust when the issuing CA is trusted. |
| DNS | Domain Name System. Resolves names, such as a server hostname, to network addresses. |
| HTTPS | HTTP protected by TLS. It is used to access the Kura console and registration websites through an encrypted connection. |
| IP address and port | An IP address identifies a network interface; a port identifies a service endpoint at that address. The broker example uses port `8883`. |
| `localhost` | A name referring to the computer on which the browser or command is running. It identifies the Raspberry Pi only when used on that device. |
| Self-signed certificate | A certificate signed by its own key rather than by an external CA. Kura's default certificate can therefore produce a browser trust warning. |
| SMTP | Simple Mail Transfer Protocol. Used by the registration service's external mail server to send verification messages. |
| SSL and TLS | SSL is the older protocol name still present in some interface labels. TLS is the protocol used to protect current HTTPS and secure MQTT connections. |
| SSLKeystore | The Kura keystore selected when importing the broker certificate in chapter 4. It stores certificate material used for secure connections. |
| Tailscale and tailnet | Tailscale provides the private network used in the temporary deployment. A tailnet is the Tailscale network to which authorized devices connect. |
| Verification code | The six-digit code emailed during VPN registration to confirm access to the supplied email address. It is separate from the auth key issued afterward. |
| VPN | Virtual Private Network. Provides private connectivity between devices across different networks or geographical locations. |
| Whitelist (allowlist) | The approved list of institutional email addresses permitted to request Tailscale access through the H2Train registration service. |

For installation and auth key details, see the Tailscale resources in
[section 5.2.3](#523-tailscale).

### 5.1.4 Eclipse Kura, Eclipse Kapua, and Messaging

| Term | Definition |
| --- | --- |
| API | Application Programming Interface. Allows one application to interact with another; the Kapua registration page uses the Kapua API to create users. |
| Broker | The MQTT server that receives published messages and forwards them to clients subscribed to the corresponding topics. |
| Clean session | An MQTT option controlling session state. With `true`, the connection starts a new session and does not preserve its session state after disconnection. |
| Client ID | The identifier representing a device's MQTT client. It must be unique within the account used by this deployment. |
| Cloud connection | The configured group of Kura services used to communicate with a cloud platform. This manual creates a dedicated maintenance connection. |
| CloudService | The Kura service providing cloud messaging and management functions above the data service and transport layers. |
| CommandService | The Kura service configured to receive and execute remote commands for maintenance operations. |
| DataService | The Kura service responsible for managing message delivery above the transport layer. Its startup option controls automatic connection in this procedure. |
| Eclipse Kapua | The cloud platform used here to manage connected devices, user access, and device communication. |
| Eclipse Kura | The software framework installed on the Raspberry Pi to configure the gateway and connect it to cloud services. |
| Edge device and gateway | An edge device operates close to local equipment or data sources. A gateway connects those devices or applications to other systems; the Raspberry Pi running Kura serves this role. |
| H2Train | The project platform referred to as Cloud Multiplatform H2Train in this manual. The documented setup uses Kapua for device maintenance. |
| IoT | Internet of Things. Connected physical devices that exchange data and can be monitored or managed through software services. |
| Keep-alive | The MQTT interval used to check that a connection remains active. The client sends a ping when needed during periods without other traffic. |
| MQTT and MQTTS | MQTT is a publish/subscribe messaging protocol. The `mqtts://` scheme in the broker URL indicates MQTT protected by TLS. |
| MqttDataTransport | The Kura transport service that connects to the MQTT broker using the configured address, credentials, and client ID. |
| PID and factory PID | A Persistent Identifier identifies a service configuration in Kura. A factory PID identifies the factory used to create service instances; a service PID identifies the configured instance. |
| Timeout | The time limit for an operation. MQTT transport and Command Service timeouts apply to different operations and are configured separately. |
| Topic | The name used to route published MQTT messages to interested subscribers. |
| Topic Context Account-Name | The account name Kura inserts into its topic namespace. The documented configuration uses `H2TRAIN`; this value is distinct from the broker username. |

The [Kura cloud connection guide](https://eclipse-kura.github.io/kura/docs-release-5.6/gateway-configuration/cloud-connections/)
and [MQTT transport configuration reference](https://eclipse-kura.github.io/kura/docs-release-5.6/gateway-configuration/data-transport-service-configuration/)
provide further details about these services and settings.

## 5.2 External References and Useful Resources

The following resources support the procedures in this manual. Use the Kura
5.6 documentation for the installation described here. Generic examples in
upstream guides may use different server addresses, accounts, or credentials;
use the deployment-specific settings in chapter 4 for H2Train.

### 5.2.1 Raspberry Pi Hardware and Operating System

| Resource | Purpose |
| --- | --- |
| [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) | Hardware specifications, interfaces, and power requirements for the device used in chapter 2. |
| [Raspberry Pi OS downloads](https://www.raspberrypi.com/software/operating-systems/) | Official operating system images and information about their architecture and Debian base. |

### 5.2.2 Eclipse Kura, Eclipse Kapua, and Java

| Resource | Purpose |
| --- | --- |
| [Eclipse Kura documentation](https://eclipse-kura.github.io/kura/) | General documentation entry point and access to other Kura documentation versions. |
| [Eclipse Kura 5.6 documentation](https://eclipse-kura.github.io/kura/docs-release-5.6/) | Documentation for the release series used in this manual. |
| [Install Kura](https://eclipse-kura.github.io/kura/docs-release-5.6/getting-started/install-kura/) | Installation profiles, package selection, and runtime requirements. |
| [Raspberry Pi quick start](https://eclipse-kura.github.io/kura/docs-release-5.6/getting-started/raspberry-pi-raspberryos-quick-start/) | Kura installation guidance for Raspberry Pi OS. |
| [Kura 5.6.2 ARM64 installer](http://download.eclipse.org/kura/releases/5.6.2/kura_5.6.2_generic-aarch64_installer.deb) | The installer file downloaded in section 3.2. |
| [Gateway Administration Console](https://eclipse-kura.github.io/kura/docs-release-5.6/gateway-configuration/gateway-administration-console/) | Console access, initial credentials, password changes, and HTTPS certificate warnings. |
| [Cloud Connections](https://eclipse-kura.github.io/kura/docs-release-5.6/gateway-configuration/cloud-connections/) | Creating and managing Kura cloud connections. |
| [Data Transport Service Configuration](https://eclipse-kura.github.io/kura/docs-release-5.6/gateway-configuration/data-transport-service-configuration/) | MQTT broker settings, client identity, sessions, and connection timeouts. |
| [Eclipse Kapua repository](https://github.com/eclipse-kapua/kapua) | Project documentation, source code, and deployment guides. |
| [Kura-to-Kapua connection guide](https://github.com/eclipse-kapua/kapua/blob/develop/docs/kuraKapuaDocs.md) | An upstream connection example to complement the H2Train procedure. |
| [Adoptium Linux installation guide](https://adoptium.net/en-GB/installation/linux) | Configuring the Temurin package repository and installing the required JDK. |

### 5.2.3 Tailscale

| Resource | Purpose |
| --- | --- |
| [Install Tailscale on Linux](https://tailscale.com/docs/install/linux) | Official Linux installation instructions and connection checks. |
| [Tailscale installation script](https://tailscale.com/install.sh) | The script used by the installation command in section 2.5.3. |
| [Tailscale auth keys](https://tailscale.com/docs/features/access-control/auth-keys) | How auth keys register devices and how key types and expiry work. |

### 5.2.4 H2Train Registration and Support

| Resource | Purpose |
| --- | --- |
| [H2Train Tailscale registration](https://tailscale-register.vercel.app/) | Request VPN access with an approved institutional email address, verify the email, and obtain an auth key. |
| [Kapua user registration](https://kapua-register.vercel.app/) | Create the individual Kapua user described in section 4.1. |
| [Deployment certificate Gist](https://gist.github.com/PhalanXinho/8a4f244f9a75e731508249004db45940) | Obtain the certificate imported into Kura in section 4.2. |
| [H2Train administrator](mailto:h2train@proton.me) | Request assistance with VPN registration, whitelist access, or auth key issuance. |
| [Jiahao Yang](mailto:jiahao.yang@ulpgc.es) | Report issues or suggest improvements to the manual. |
| [PhalanXinho on GitHub](https://github.com/PhalanXinho) | The reviewer's GitHub profile, also linked in chapter 6. |
