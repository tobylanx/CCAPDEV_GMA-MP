# BookMyLab

BookMyLab is a web application for lab reservation systems that allows users to add reservations, edit reservations, and view their reservation history. This web application aims to enable users to manage their lab reservations easily.

## Description

BookMyLab is a feature-rich web application for lab reservation systems that simplifies the management of lab bookings. This application's primary goal is to give users a quick and straightforward way to create, update, and check the history of their lab reservations. Users can easily manage their lab schedules with BookMyLab, guaranteeing that bookings are structured and conflicts are avoided. The program provides a user-friendly interface for easy interaction and navigation. Essential features include a straightforward reservation management system, a thorough view of past reservations, and user authentication with a "remember me" option for up to three weeks. With its construction based on cutting-edge technologies like Node.js, Express, and MongoDB, BookMyLab guarantees a stable and responsive user experience. It benefits students who require an efficient system for scheduling lab time. BookMyLab improves the overall effectiveness of lab management by eliminating scheduling conflicts, saving time, and automating the reservation process.

## Getting Started

### Dependencies
1. **MongoDB** will be utilized as the database for the BookMyLab web application. MongoDB Community Edition version 7 must be installed.

* MacOS - MongoDB 7.0 Community Edition supports macOS 11 or later.

* Windows - MongoDB 7.0 Community Edition supports the following 64-bit versions of Windows on x86_64 architecture: 
    * Windows Server 2022
    * Windows Server 2019
    * Windows 11 
    * MongoDB only supports the 64-bit versions of these platforms.

* Linux
    * Red Hat - MongoDB 7.0 Community Edition supports the following 64-bit versions of Red Hat Enterprise Linux (RHEL), CentOS Linux, Oracle Linux [1], Rocky Linux, and AlmaLinux [2] on x86_64 architecture:
        * RHEL / CentOS Stream / Oracle / Rocky / AlmaLinux 9
        * RHEL / CentOS Stream / Oracle / Rocky / AlmaLinux 8
        * RHEL / CentOS / Oracle 7
        * MongoDB only supports the 64-bit versions of these platforms. MongoDB 7.0 Community Edition on RHEL / CentOS / Oracle / Rocky / AlmaLinux also supports the ARM64 architecture on select platforms. 

    * Ubuntu - MongoDB 7.0 Community Edition supports the following 64-bit Ubuntu LTS (long-term support) releases on x86_64 architecture:
        * 22.04 LTS ("Jammy")
        * 20.04 LTS ("Focal")
        * MongoDB only supports the 64-bit versions of these platforms. To determine which Ubuntu release your host is running, run the following command on the host's terminal:
            ```
            cat /etc/lsb-release
            ```
        * MongoDB 7.0 Community Edition on Ubuntu also supports the ARM64 architecture on select platforms.
    * Debian - MongoDB 7.0 Community Edition supports the following 64-bit Debian releases on x86_64 architecture:
        * Debian 12 "Bookworm"
        * Debian 11 "Bullseye"
        * MongoDB only supports the 64-bit versions of these platforms.

    * SUSE - MongoDB 7.0 Community Edition supports the following 64-bit SUSE Linux Enterprise Server (SLES) releases on x86_64 architecture:
        * SLES 15
        * SLES 12
        * MongoDB only supports the 64-bit versions of these platforms.

    * Amazon - MongoDB 7.0 Community Edition supports the following 64-bit Amazon Linux release on x86_64 architecture:
        * Amazon Linux 2023
        * Amazon Linux 2
        * MongoDB only supports the 64-bit versions of this platform.

You have the option to self-manage and host the Community Edition locally or in the cloud. Additionally, you may create free local experiences for full-text and vector search as well as cloud-based applications using MongoDB Atlas.

If you opt to host the Community Edition locally, you may download MongoDB Compass through this [link](https://www.mongodb.com/docs/compass/current/install/).

However, if you opt to use the cloud, you must create an account and access the database through this [link](https://account.mongodb.com/account/register?_ga=2.232786590.1042261310.1720516851-2116443035.1717582412&_gac=1.254493434.1720615095.CjwKCAjw4ri0BhAvEiwA8oo6FyWi4GZGXj_8Hfx_TOynE03VMh_Wl5-0cz5jRSQyhi7SSXJ5P7jQRxoCQj4QAvD_BwE)


2. **Node.js** must also be installed in your machines in order to run the web application successfully. Official packages for all the major platforms are available through this [link](https://nodejs.org/download/).

For more information about Node.js, follow this [link](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs).

### Installing
To access BookMyLab web application, you may download it through [Google Drive](https://drive.google.com/drive/folders/1QTH2ZntcVWvSNKylNIwiu2YCa3H5ABEa?usp=sharing), [GitHub], or this ZIP file. **(NOT SURE PA IF PWEDE MAG EMBEDD NG FILE + ADD LINKS)**

### Executing program
* To start the MongoDB, enter the following commands to your command line interface (CLI),
    ```
    npm init -y
    npm install express body-parser mongoose path express-validator crypto cookie-parser multer 
    node server.js 
    ```
    Ensure that you have Node.js installed.

* Open the file you have previously downloaded and open _index.html_. **(<-ccheck pa if sa index talaga dapat)**
* Create an account if you don't have one or log in to your account.
* Naviagte the website depending on what you wish to accomplish with it.
* To stop MongoDB from running, simply press the control key + C.

### Features of BookMyLab
Aside from registering an account and logging in, the following are the features of the BookMyLab web application:

For **Students**:
1. Reserve - Students can reserve available lab slots. Reservations can be made anonymously. A student may opt to reserve more than one slot in a lab.
2. Edit Reservation - Students can edit the reservations they made.
3. See Reservations - Students can view their reservations as well as the details of the reservation such as seat number, laboratory, date and time of the reservation, and date and time of request.
4. View/Edit User Profile - Students can view and edit their profile, which includes a profile picture and description. Students may also view other's profiles.
5. Delete User Account - Students can delete their account. Additionally, the reservations made will be canceled if there are any.

For **Technicians**:
1. Reserve for a Student - Technicians can reserve slots for walk-in students.
2. Remove Reservations - Technicians can remove student reservations if they do not show up within 10 minutes of the reservation.
3. Edit Reservation - Technicians can edit any of the reservations.
4. See Reservations - Technicians can view their reservations as well as the details of the reservation such as seat number, laboratory, date and time of the reservation, and date and time of request.
5. View/Edit User Profile - Technicians can view and edit their profile, which includes a profile picture and description. Technicians may also view other's profiles.


## Authors
Feel free to contact any of the contributors below if you encounter any issues or have questions:
* [Chua, Genelle M.](genelle_chua@dlsu.edu.ph)
* [Tarrosa, Marsha Alyssa Terese G.](marsha_tarrosa@dlsu.edu.ph)
* [Tobias, Angela V.](angela_tobias@dlsu.edu.ph)


## Acknowledgments

