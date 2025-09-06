# Receiptify - Automated Expense Tracker

Receiptify is a full-stack web application designed to simplify expense tracking. Users can upload images of their receipts, and the application automatically extracts key information like the vendor, amount, and date using Optical Character Recognition (OCR). This project is built with a focus on security, scalability, and modern development practices, leveraging a MERN stack and cloud services from AWS and Google Cloud.

**Live Demo : `<link>`**

## Key Features

* **Secure User Authentication:** Robust authentication system using JWTs stored in secure `httpOnly` cookies.
* **Cloud Image Uploads:** Securely upload and store receipt images in an AWS S3 bucket.
* **Automated Data Extraction:** Leverages Google Cloud Vision API to automatically parse text from receipts.
* **Full CRUD Functionality:** Users can create, read, update, and delete their expenses through a RESTful API.
* **Production-Ready Security:** Implements rate limiting, secure HTTP headers (`helmet`), and CORS policies.
* **Input Validation:** Server-side validation of all user input to ensure data integrity.

## Architecture & System Design

The application is architected with a decoupled frontend and backend, communicating via a RESTful API. The diagram below illustrates the core components and data flow.

<pre class="vditor-reset" placeholder="" contenteditable="true" spellcheck="false"><p data-block="0"><img src="https://file+.vscode-resource.vscode-cdn.net/c%3A/Users/Jaymin/Desktop/Receiptify/image/README/1757127232311.png" alt="1757127232311"/></p></pre>

### System Workflow

1. **User Uploads Image:** The React frontend sends the receipt image to the Node.js/Express backend.
2. **Store in S3:** The backend uploads the image to a secure AWS S3 bucket and gets a public URL.
3. **Process with Vision API:** The backend sends the image URL to the Google Cloud Vision API for processing.
4. **Extract & Parse Data:** The Vision API returns the extracted text. The backend then parses this text to find the vendor, amount, and date.
5. **Create Expense Record:** Once the data is successfully parsed, a new 'Expense' document is created in MongoDB with the final details and the S3 image URL.
6. **Display to User:** The frontend queries the API and displays the newly created expense information on the user's dashboard.

## Tech Stack

This project uses a modern and robust set of technologies chosen for performance and security.

| **Category**              | **Technology**                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| **Frontend**              | React.js, TailwindCSS                                                                         |
| **Backend**               | Node.js, Express.js                                                                           |
| **Database**              | MongoDB (with Mongoose)                                                                       |
| **Authentication**        | JSON Web Tokens (JWT), bcryptjs                                                               |
| **Security & Middleware** | `helmet`,`cors`,`express-rate-limit`,`express-validator`,`morgan`,`cookie-parser` |
| **Cloud Services**        | **AWS S3**(for image storage),**Google Cloud Vision API**(for OCR)                |
| **Deployment**            | **AWS EC2 / Elastic Beanstalk**(Backend),**AWS S3 & CloudFront**(Frontend)        |
