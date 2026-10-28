# 1. System Overview

The H2Train system combines device-side services, a private network, and cloud
management services. This chapter explains their responsibilities, how messages
travel between them, and how access is controlled.

## 1.1 Main Components and Responsibilities

| Component | Responsibility in this deployment |
| --- | --- |
| Raspberry Pi 4 Model B | Hosts the operating system, Java runtime, and Kura installation. It acts as the edge gateway. |
| Raspberry Pi OS | Provides the Linux environment, network interfaces, package-management tools, and administrative access needed to install and operate the software. |
| Eclipse Temurin JDK 17 | Supplies the Java runtime used to execute Kura, together with Java development tools. |
| Eclipse Kura | Runs on the Raspberry Pi and provides the administration console, cloud connection services, and remote command execution service. |
| Eclipse Kapua | Provides the cloud environment used for user access, device communication, and maintenance management. |
| Tailscale | Provides the private network connectivity used to connect the device and the Kapua environment from different locations. |
| H2Train registration services | Provide the web forms used to request Tailscale access and create individual Kapua users. |

Cloud Multiplatform H2Train is the project environment in which these components
are used together. The registration services support access provisioning;
ongoing device communication uses the configured broker connection.

## 1.2 Edge-to-Cloud Architecture

On the Raspberry Pi, Kura runs within the Java environment and uses the device's
Ethernet or Wi-Fi connection to reach the remote services. Its maintenance cloud
connection communicates with the MQTT broker using MQTT over TLS, identified by
the `mqtts://` scheme in the broker URL.

The current implementation uses Tailscale to provide private connectivity across
different geographical locations. This network access must be established
before Kura can reach the configured broker. The broker address, account name,
and connection settings are specified in
[chapter 4](04-connecting-to-h2train.md).

TLS provides certificate-based protection for the broker connection. The
certificate imported into Kura's **SSLKeystore** establishes the trust required
by the documented setup. VPN access and TLS configuration are therefore both
part of the connection procedure.

Browser-based administration provides access to the Kura console on the device
and the Kapua console on the server. The Kura console is used to configure local
services; the Kapua console provides the server-side administration view.

The planned cloud-hosted Kapua deployment will provide a server address reachable
from users' networks through DNS. Tailscale supplies the connectivity used by
the current implementation while that deployment is being prepared.

## 1.3 Data Flow and Device Management

Kura initiates the connection to the broker using the configured account,
credentials, and client ID. The broker routes messages according to their MQTT
topics and the permissions assigned to the connecting account. Communication
over this connection supports messages from the device and management requests
sent toward the device.

The maintenance connection is configured through three related Kura services:

- **CloudService-Maintainer:** provides the cloud service instance used for
  maintenance communication.
- **DataService-Maintainer:** manages message delivery and enables automatic
  connection at startup.
- **MqttDataTransport-Maintainer:** defines the broker endpoint, account context,
  authentication credentials, client ID, and MQTT connection settings.

The **CommandService** handles remote command execution on the Raspberry Pi.
Its configuration includes a command password, working directory, execution
timeout, and privilege setting. These settings prepare the device for the
maintenance operations described in the deployment.

## 1.4 Authentication and Access Control

The system uses separate credentials and permissions for network access, user
identity, broker communication, and remote commands.

| Access mechanism | Role |
| --- | --- |
| Institutional email verification | Confirms access to an approved email address before the registration service issues a Tailscale auth key. |
| Tailscale auth key | Registers the device on the private network. |
| Individual Kapua account | Identifies a registered user with the role assigned by the registration system. |
| Maintenance broker credentials | Authenticate Kura's maintenance connection with the dedicated account and its assigned permissions. |
| Broker certificate trust | Allows Kura to validate the broker certificate using the certificate material imported into SSLKeystore. |
| Command password | Provides the password configured for remote command requests handled by CommandService. |

The device's MQTT client ID identifies its connection and must be unique within
the account. The Tailscale device name and the Kapua username are configured
separately during their respective registration procedures.

Configuration details are provided in [chapter 4](04-connecting-to-h2train.md).
Definitions and supporting documentation are available in
[chapter 5](05-glossary-and-references.md).
