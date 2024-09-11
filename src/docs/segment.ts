/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Endpoints related to segment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Segment:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the segment
 *         name:
 *           type: string
 *           description: The name of the segment
 *         description:
 *           type: string
 *           description: A description of the segment
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the segment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the segment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the segment was last updated
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/segments/all:
 *   get:
 *     summary: Get all segments in the application
 *     description: Retrieves all segments. Accessible only by admin users.
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all segments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Segment'
 *       404:
 *         description: No segments found
 *       500:
 *         description: Failed to retrieve segments
 */

/**
 * @swagger
 * /api/segments:
 *   get:
 *     summary: Get segments created by the authenticated user
 *     description: Retrieves all segments created by the authenticated user.
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of segments created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Segment'
 *       404:
 *         description: No segments found
 *       500:
 *         description: Failed to retrieve segments
 */

/**
 * @swagger
 * /api/segments/{id}:
 *   get:
 *     summary: Get a single segment
 *     description: Retrieves a single segment by its ID. User can only access their own segments.
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The segment ID
 *     responses:
 *       200:
 *         description: The segment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segment:
 *                   $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 *       500:
 *         description: Failed to retrieve segment
 */

/**
 * @swagger
 * /api/segments:
 *   post:
 *     summary: Create a new segment
 *     description: Creates a new segment for the authenticated user.
 *     tags: [Segments]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newSegment:
 *                   $ref: '#/components/schemas/Segment'
 *       500:
 *         description: Failed to create segment
 */

/**
 * @swagger
 * /api/segments/{id}:
 *   put:
 *     summary: Update a segment
 *     description: Updates an existing segment. User can only update their own segments.
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The segment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedSegment:
 *                   $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 *       500:
 *         description: Failed to update segment
 */

/**
 * @swagger
 * /api/segments/{id}:
 *   delete:
 *     summary: Delete a segment
 *     description: Deletes an existing segment. User can only delete their own segments.
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The segment ID
 *     responses:
 *       200:
 *         description: The deleted segment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedSegment:
 *                   $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 *       500:
 *         description: Failed to delete segment
 */