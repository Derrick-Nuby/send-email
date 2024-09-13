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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing subscriber data
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
 *                 subscribers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       isSubscribed:
 *                         type: boolean
 *                       segmentId:
 *                         type: string
 *                       createdBy:
 *                         type: string
 *                       customFields:
 *                         type: object
 *                         additionalProperties: true
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded or invalid file type"
 *       500:
 *         description: Failed to create subscribers from CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create subscribers from CSV"
 */


/**
 * @swagger
 * /api/subscribers/change-segment:
 *   post:
 *     summary: Change the segment of multiple subscribers
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
 *               subscriberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of subscriber IDs
 *               newSegmentId:
 *                 type: string
 *                 description: The ID of the new segment
 *     responses:
 *       200:
 *         description: Subscribers updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 modifiedCount:
 *                   type: number
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: No subscribers found or updated
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/subscribers/search:
 *   get:
 *     summary: Search for subscribers based on query, subscription status, or segment
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search string to filter subscribers by name, email, or custom fields
 *       - in: query
 *         name: subscribed
 *         schema:
 *           type: string
 *         description: Filter by subscription status (true or false)
 *       - in: query
 *         name: segmentid
 *         schema:
 *           type: string
 *         description: Segment ID to filter subscribers
 *     responses:
 *       200:
 *         description: Subscribers found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: No subscribers found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/subscribers/bulk:
 *   delete:
 *     summary: Bulk delete subscribers
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
 *               subscriberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of subscriber IDs to delete
 *     responses:
 *       200:
 *         description: Subscribers deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: number
 *                 notFoundIds:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: No subscribers found or deleted
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/subscribers/preview-upload:
 *   post:
 *     summary: Preview a CSV file upload for subscribers
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to preview
 *     responses:
 *       200:
 *         description: CSV preview processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRows:
 *                   type: number
 *                 validSubscribers:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     sample:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Subscriber'
 *                 invalidEntries:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *                 summary:
 *                   type: object
 *       400:
 *         description: No file uploaded or invalid CSV
 *       500:
 *         description: Failed to process CSV preview
 */
