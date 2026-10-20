# 2. Hardware, Software, and Prerequisites

This chapter defines the hardware and software prerequisites for installing
Eclipse Kura. It describes the equipment and operating environment used
successfully in the current implementation.

Devices with similar capabilities may also be suitable. However, their operating
system, processor architecture, and compatibility with the selected Kura package
must be checked before applying the installation procedure.

## 2.1 Hardware Requirements

The current implementation uses a **Raspberry Pi 4 Model B with 4 GB of RAM**.
The following table summarizes the specifications of the hardware used; it does
not define the minimum requirements for every Kura deployment.

| Component | Specification |
| --- | --- |
| Processor | Broadcom BCM2711, quad-core Cortex-A72 (ARMv8), 64-bit SoC at 1.8 GHz |
| Memory | 4 GB LPDDR4-3200 SDRAM in the model used |
| Wireless connectivity | 2.4 GHz and 5.0 GHz IEEE 802.11ac Wi-Fi, Bluetooth 5.0, and Bluetooth Low Energy (BLE) |
| Wired connectivity | Gigabit Ethernet |
| USB ports | Two USB 3.0 ports and two USB 2.0 ports |
| Display outputs | Two micro-HDMI ports, supporting up to 4K at 60 frames per second |
| Display interface | Two-lane MIPI DSI display port |
| Camera interface | Two-lane MIPI CSI camera port |
| Audio and composite video | Four-pole stereo audio and composite video port |
| Video processing | H.265 decoding at 4K/60 fps; H.264 decoding at 1080p/60 fps and encoding at 1080p/30 fps |
| Storage | microSD card slot for the operating system and data storage |
| USB-C power input | 5 V DC, with a supply rated for at least 3 A |
| Alternative power input | 5 V DC through the GPIO header, with a supply rated for at least 3 A |

For further specifications, consult the
[official Raspberry Pi 4 Model B product page](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/).

Provide a microSD card for the operating system and a suitable power supply.
The USB-C and GPIO entries above describe alternative power inputs.

## 2.2 Peripherals and Network Connectivity

For local setup and interaction with the Raspberry Pi, a keyboard, mouse, and
display with a suitable micro-HDMI cable or adapter are recommended. Remote
administration through SSH is also possible once network access and SSH have
been configured.

Configure at least one network interface before starting the installation:

- **Ethernet:** connect the device to the network using an Ethernet cable.
- **Wi-Fi:** configure the wireless network and verify that the device can connect.

Internet access is required to update system packages and download Kura and its
dependencies.

## 2.3 Operating System

The current implementation uses **Raspberry Pi OS based on Debian 13 (Trixie)**.
Raspberry Pi OS was previously known as Raspbian. Official images are available
from the [Raspberry Pi OS download page](https://www.raspberrypi.com/software/operating-systems/).

Use the **64-bit edition** for the procedure in
[Chapter 4: Installing Eclipse Kura](04-installing-eclipse-kura.md), which uses
the `aarch64` installer. The Adoptium repository configured in that chapter also
targets the `trixie` release.

## 2.4 User Accounts and Administrative Permissions

The device must have a user account that can execute commands with administrative
privileges through `sudo`. These privileges are needed to install packages,
configure repositories, and restart the device.

Confirm that the account can use `sudo` before beginning the installation.

## 2.5 System Preparation and Software Dependencies

Update the package lists and upgrade installed system packages before installing
Kura. The commands are provided in section 4.1.

Beyond the operating system and standard command-line utilities, no additional
application software needs to be installed in advance. An existing Kura or Java
installation is not required: Chapter 4 covers the installation of Eclipse
Temurin JDK 17, the required utilities, and Eclipse Kura 5.6.2. Ensure that `wget`
is available before the installer download step in section 4.2.
