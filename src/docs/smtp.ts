/**
 * @swagger
 * tags:
 *   name: SMTPS
 *   description: Endpoints related to SMTP management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SMTP:
 *       type: object
 *       required:
 *         - name
 *         - fromEmail
 *         - auth
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the SMTP configuration
 *         name:
 *           type: string
 *           description: The name of the SMTP configuration
 *         fromEmail:
 *           type: string
 *           description: The email address used in the SMTP configuration
 *         service:
 *           type: string
 *           description: The email service provider (optional)
 *         pool:
 *           type: boolean
 *           description: Whether to use connection pooling
 *         host:
 *           type: string
 *           description: The host of the SMTP server (optional)
 *         port:
 *           type: number
 *           description: The port used for the SMTP connection (optional)
 *         secure:
 *           type: boolean
 *           description: Whether to use a secure connection
 *         auth:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               description: The username for SMTP authentication
 *             pass:
 *               type: string
 *               description: The password for SMTP authentication
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the SMTP configuration
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the SMTP configuration was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the SMTP configuration was last updated
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/smtps/:
 *   get:
 *     summary: Get all SMTP configurations
 *     description: Retrieves all SMTP configurations. Accessible only by admin users.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all SMTP configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 smtps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SMTP'
 *       404:
 *         description: No SMTP configurations found
 *       500:
 *         description: Failed to retrieve SMTP configurations
 */

/**
 * @swagger
 * /api/smtps/user:
 *   get:
 *     summary: Get SMTP configurations created by the authenticated user
 *     description: Retrieves all SMTP configurations created by the authenticated user.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of SMTP configurations created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 smtps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SMTP'
 *       404:
 *         description: No SMTP configurations found
 *       500:
 *         description: Failed to retrieve SMTP configurations
 */

/**
 * @swagger
 * /api/smtps/{id}:
 *   get:
 *     summary: Get a single SMTP configuration
 *     description: Retrieves a single SMTP configuration by its ID. User can only access their own configurations.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The SMTP configuration ID
 *     responses:
 *       200:
 *         description: The SMTP configuration details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 smtp:
 *                   $ref: '#/components/schemas/SMTP'
 *       404:
 *         description: SMTP configuration not found
 *       500:
 *         description: Failed to retrieve SMTP configuration
 */

/**
 * @swagger
 * /api/smtps/:
 *   post:
 *     summary: Create a new SMTP configuration
 *     description: Creates a new SMTP configuration for the authenticated user.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - fromEmail
 *               - auth
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the SMTP configuration
 *               fromEmail:
 *                 type: string
 *                 description: The email address used in the SMTP configuration
 *               auth:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                     description: The username for SMTP authentication
 *                   pass:
 *                     type: string
 *                     description: The password for SMTP authentication
 *     responses:
 *       201:
 *         description: The created SMTP configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newSmtp:
 *                   $ref: '#/components/schemas/SMTP'
 *       500:
 *         description: Failed to create SMTP configuration
 */

/**
 * @swagger
 * /api/smtps/{id}:
 *   put:
 *     summary: Update an SMTP configuration
 *     description: Updates an existing SMTP configuration. User can only update their own configurations.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The SMTP configuration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the SMTP configuration
 *               fromEmail:
 *                 type: string
 *                 description: The email address used in the SMTP configuration
 *               auth:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                     description: The username for SMTP authentication
 *                   pass:
 *                     type: string
 *                     description: The password for SMTP authentication
 *     responses:
 *       200:
 *         description: The updated SMTP configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedSmtp:
 *                   $ref: '#/components/schemas/SMTP'
 *       404:
 *         description: SMTP configuration not found
 *       500:
 *         description: Failed to update SMTP configuration
 */

/**
 * @swagger
 * /api/smtps/{id}:
 *   delete:
 *     summary: Delete an SMTP configuration
 *     description: Deletes an existing SMTP configuration. User can only delete their own configurations.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The SMTP configuration ID
 *     responses:
 *       200:
 *         description: The deleted SMTP configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedSmtp:
 *                   $ref: '#/components/schemas/SMTP'
 *       404:
 *         description: SMTP configuration not found
 *       500:
 *         description: Failed to delete SMTP configuration
 */

/**
 * @swagger
 * /api/smtps/sendVerification:
 *   post:
 *     summary: Send SMTP verification email
 *     description: Sends a verification email using the specified SMTP configuration to verify its settings.
 *     tags: [SMTPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - smtpId
 *               - email
 *             properties:
 *               smtpId:
 *                 type: string
 *                 description: The ID of the SMTP configuration to verify
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to send the verification email to
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 info:
 *                   type: object
 *                   description: Information about the sent email
 *       400:
 *         description: Bad request (missing SMTP ID or email)
 *       404:
 *         description: SMTP configuration not found
 *       500:
 *         description: Failed to send verification email
 */

/**
 * @swagger
 * /api/smtps/verify/{token}:
 *   get:
 *     summary: Verify SMTP configuration
 *     description: Verifies an SMTP configuration using the provided token from the verification email.
 *     tags: [SMTPS]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token received in the email
 *     responses:
 *       200:
 *         description: SMTP configuration successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 smtp:
 *                   $ref: '#/components/schemas/SMTP'
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: SMTP configuration not found
 *       500:
 *         description: Failed to verify SMTP configuration
 */