/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Operations related to sending emails.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailRequest:
 *       type: object
 *       required:
 *         - smtpId
 *         - recipients
 *         - subject
 *         - content
 *       properties:
 *         smtpId:
 *           type: string
 *           description: The ID of the SMTP configuration to be used.
 *         fromEmail:
 *           type: string
 *           description: (Optional) The sender's email address. Defaults to the one in the SMTP configuration.
 *         recipients:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of recipient email addresses. Can also be a single email.
 *           example: ["example1@test.com", "example2@test.com"]
 *         subject:
 *           type: string
 *           description: The subject of the email.
 *         content:
 *           type: string
 *           description: The HTML content of the email to be sent.
 *         batchLimit:
 *           type: integer
 *           default: 500
 *           description: The number of emails to send per batch.
 *         batchInterval:
 *           type: integer
 *           default: 1440
 *           description: The time interval (in minutes) between each batch of emails.
 *         method:
 *           type: string
 *           enum: ['mySubscriberList', 'bySegment']
 *           description: Determines if emails are sent to the user's own subscriber list or by a segment.
 *         segmentId:
 *           type: string
 *           description: The ID of the segment when using the 'bySegment' method.
 */

/**
 * @swagger
 * /api/emails/send:
 *   post:
 *     summary: Send an email to a list of recipients.
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       202:
 *         description: Email sending process initiated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sending process initiated.
 *                 totalRecipients:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       500:
 *         description: Internal server error. Failed to initiate the email sending process.
 */

/**
 * @swagger
 * /api/emails/predefined:
 *   post:
 *     summary: Send emails to predefined users based on method (mySubscriberList or bySegment).
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       202:
 *         description: Email sending process initiated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email sending process initiated.
 *                 totalRecipients:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       404:
 *         description: No recipients found.
 *       500:
 *         description: Internal server error. Failed to initiate the email sending process.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
