/**
 * @swagger
 * components:
 *   schemas:
 *     Subscriber:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - notes
 *         - segmentId
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the subscriber.
 *         name:
 *           type: string
 *           description: Name of the subscriber.
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the subscriber.
 *         notes:
 *           type: string
 *           description: Notes about the subscriber.
 *         isSubscribed:
 *           type: boolean
 *           default: true
 *           description: Whether the subscriber is still subscribed.
 *         segmentId:
 *           type: string
 *           description: Reference to the segment this subscriber belongs to.
 *         createdBy:
 *           type: string
 *           description: User who created this subscriber.
 *         customFields:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           description: Custom fields associated with the subscriber.
 */

/**
 * @swagger
 * tags:
 *   name: Subscribers
 *   description: API for managing subscribers
 */

/**
 * @swagger
 * /api/subscribers:
 *   get:
 *     summary: Get all subscribers created by the logged-in user
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: No subscribers found
 *       500:
 *         description: Failed to retrieve subscribers
 */

/**
 * @swagger
 * /api/subscribers/all:
 *   get:
 *     summary: Get all subscribers in the application
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: No subscribers found
 *       500:
 *         description: Failed to retrieve subscribers
 */

/**
 * @swagger
 * /api/subscribers/segment/{segmentId}:
 *   get:
 *     summary: Get all subscribers in a specific segment created by the logged-in user
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: segmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Segment ID to retrieve subscribers from
 *     responses:
 *       200:
 *         description: List of subscribers in the segment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: No subscribers found in this segment
 *       500:
 *         description: Failed to retrieve subscribers
 */

/**
 * @swagger
 * /api/subscribers/{id}:
 *   get:
 *     summary: Get a single subscriber by ID
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subscriber to retrieve
 *     responses:
 *       200:
 *         description: Subscriber details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Failed to retrieve subscriber
 */

/**
 * @swagger
 * /api/subscribers:
 *   post:
 *     summary: Create a new subscriber
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               notes:
 *                 type: string
 *               segmentId:
 *                 type: string
 *               customFields:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: New subscriber created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       500:
 *         description: Failed to create subscriber
 */

/**
 * @swagger
 * /api/subscribers/{id}:
 *   put:
 *     summary: Update an existing subscriber
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subscriber to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               notes:
 *                 type: string
 *               isSubscribed:
 *                 type: boolean
 *               customFields:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subscriber updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Failed to update subscriber
 */

/**
 * @swagger
 * /api/subscribers/{id}:
 *   delete:
 *     summary: Delete a subscriber
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subscriber to delete
 *     responses:
 *       200:
 *         description: Subscriber deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Failed to delete subscriber
 */

/**
 * @swagger
 * /api/subscribers/file:
 *   post:
 *     summary: Upload a CSV file to create subscribers
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscribers created successfully from CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "1234 subscribers have been created"
 *       500:
 *         description: Failed to create subscribers from CSV
 */
