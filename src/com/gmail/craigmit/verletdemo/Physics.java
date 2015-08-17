package com.gmail.craigmit.verletdemo;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.geom.Point2D;

/**
 * <p>Original C++ code written by Benedikt Bitterli Copyright (c) 2009
 * <p>Original C++ code and tutorial available at {@link http://www.gamedev.net/reference/programming/features/verletPhys/default.asp}.
 * <p>Conversion from C++ to Java done by Craig Mitchell Copyright (c) 2010.
 * <p>
 * <pre>
 * The code is released under the ZLib/LibPNG license.
 * It basically means that you can treat the source in any way you like (including commercial applications),
 * but you may not claim that you wrote it.
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 *     1. The origin of this software must not be misrepresented; you must not
 *        claim that you wrote the original software. If you use this software
 *        in a product, an acknowledgment in the product documentation would be
 *        appreciated but is not required.
 *        
 *     2. Altered source versions must be plainly marked as such, and must not be
 *        misrepresented as being the original software.
 *        
 *     3. This notice may not be removed or altered from any source distribution.
 * </pre>
 * 
 * @author Craig Mitchell
 * @since 21/01/2010
 */
public class Physics {
	public static final int MAX_BODIES = 256;  //Maximum body/vertex/edgecount the physics simulation can handle
	public static final int MAX_VERTICES = 1024;
	public static final int MAX_EDGES = 1024;
	public static final int MAX_BODY_VERTICES = 10; //Maximum body/edge count a body can contain
	public static final int MAX_BODY_EDGES = 10;
	private static Point2D.Float axis = new Point2D.Float(0, 0);

	private int screenWidth;
	private int screenHeight;
	
	private Point2D.Float gravity;
	private int bodyCount;
	private int vertexCount;
	private int edgeCount;
	private Vertex[]      vertices = new Vertex[MAX_VERTICES];
	private Edge[]        edges    = new Edge[MAX_EDGES];
	private PhysicsBody[] bodies   = new PhysicsBody[MAX_BODIES];
	private float timestep;
	private int iterations;

	/**
	 * Inner class CollisionInfo
	 * @author Craig Mitchell
	 */
	public static class CollisionInfo {
		static float depth;
		static Point2D.Float normal = new Point2D.Float(0, 0);
		static Edge e;
		static Vertex v;
	};
	
	/**
	 * Sets the force on each vertex to the gravity force. You could of course apply other forces like magnetism etc.
	 */
	private void updateForces() {
		for (int I=0; I<vertexCount; I++ ) {
			this.vertices[ I ].acceleration = this.gravity;
		}
	}

	/**
	 * Updates the vertex position
	 */
	private void updateVerlet() {
		float tempX;
		float tempY;

		for (int i = 0; i < vertexCount; i++) {
			Vertex v = vertices[i];
			tempX = v.position.x;
			tempY = v.position.y;
			v.position.x += v.position.x - v.oldPosition.x + v.acceleration.x * timestep*timestep;
			v.position.y += v.position.y - v.oldPosition.y + v.acceleration.y * timestep*timestep;
			v.oldPosition.x = tempX;
			v.oldPosition.y = tempY;
		}
	}
	
	private void updateEdges() {
		for (int i = 0; i < edgeCount; i++) {
			Edge e = edges[ i ];

			// Calculate the vector between the two vertices
			float v1v2x = e.v2.position.x - e.v1.position.x;
			float v1v2y = e.v2.position.y - e.v1.position.y;

			float v1v2Length = (float)Math.hypot(v1v2x, v1v2y);; //Calculate the current distance
			float diff       = v1v2Length - e.length; //Calculate the difference from the original length
			
			// Normalise
			float len = 1.0f/(float)Math.hypot(v1v2x, v1v2y);
			v1v2x *= len;
			v1v2y *= len;

			// Push both vertices apart by half of the difference respectively so the distance between them equals the original length
			e.v1.position.x += v1v2x * diff * 0.5f;
			e.v1.position.y += v1v2y * diff * 0.5f;
			e.v2.position.x -= v1v2x * diff * 0.5f;
			e.v2.position.y -= v1v2y * diff * 0.5f;
		}
	}

	private void iterateCollisions() {
		for(int i = 0; i < iterations; i++ ) { //Repeat this a few times to give more exact results
			//A small 'hack' that keeps the vertices inside the screen. You could of course implement static objects and create
			//four to serve as screen boundaries, but the max/min method is faster
			for (int t = 0; t < vertexCount; t++ ) {
				Point2D.Float pos = vertices[ t ].position;
				pos.x = Math.max( Math.min( pos.x, (float)screenWidth  ), 0.0f );
				pos.y = Math.max( Math.min( pos.y, (float)screenHeight ), 0.0f );
			}

			updateEdges(); //Edge correction step

			for (int j = 0; j < this.bodyCount; j++) {
				this.bodies[j].calculateCenter(); //Recalculate the center
			}

			for (int b1 = 0; b1 < bodyCount; b1++) { //Iterate trough all bodies
				for (int b2 = 0; b2 < bodyCount; b2++) {
					if (b1 != b2) {
						if (bodiesOverlap(bodies[b1], bodies[b2])) { //Test the bounding boxes
							if (detectCollision(bodies[b1], bodies[b2])) { //If there is a collision, respond to it
								processCollision();
							}
						}
					}
				}
			}
		}
	}
	
	private static boolean detectCollision( PhysicsBody b1, PhysicsBody b2 ) {
		float minDistance = 10000.0f; //Initialize the length of the collision vector to a relatively large value

		for (int i = 0; i < b1.edgeCount + b2.edgeCount; i++ ) { //Just a fancy way of iterating through all of the edges of both bodies at once
			Edge e;

			if (i < b1.edgeCount) {
				e = b1.edges[i];
			}
			else {
				e = b2.edges[i - b1.edgeCount];
			}

			//This will skip edges that lie totally inside the bodies, as they don't matter.
			//The boundary flag has to be set manually and defaults to true
			if (e.boundary == false) {
				continue;
			}

			// Calculate the perpendicular to this edge and normalize it
			axis.x = e.v1.position.y - e.v2.position.y;
			axis.y = e.v2.position.x - e.v1.position.x;
			
			// Normalise
			float len = 1.0f/(float)Math.hypot(axis.x, axis.y);
			axis.x *= len;
			axis.y *= len;

			// Project both bodies onto the perpendicular
			MinMax dataA = b1.ProjectToAxis( axis );
			MinMax dataB = b2.ProjectToAxis( axis );

			float distance = IntervalDistance( dataA.min, dataA.max, dataB.min, dataB.max ); //Calculate the distance between the two intervals

			// If the intervals don't overlap, return, since there is no collision
			if (distance > 0.0f) {
				return false;
			}
			else if (Math.abs(distance) < minDistance ) {
				minDistance = Math.abs(distance);

				// Save collision information for later
				CollisionInfo.normal.x = axis.x;
				CollisionInfo.normal.y = axis.y;
				CollisionInfo.e      = e;    //Store the edge, as it is the collision edge
			}
		}

		CollisionInfo.depth = minDistance;

		if (CollisionInfo.e.parent != b2) { //Ensure that the body containing the collision edge lies in B2 and the one conatining the collision vertex in B1
			PhysicsBody temp = b2;
			b2 = b1;
			b1 = temp;
		}
		
		// int Sign = SGN( CollisionInfo.Normal.multiplyVal( B1.Center.minus(B2.Center) ) ); //This is needed to make sure that the collision normal is pointing at B1
		float xx = b1.center.x - b2.center.x;
		float yy = b1.center.y - b2.center.y;
		float mult = CollisionInfo.normal.x * xx + CollisionInfo.normal.y * yy;

		// Remember that the line equation is N*( R - R0 ). We choose B2->Center as R0; the normal N is given by the collision normal

		if (mult < 0) {
			// Revert the collision normal if it points away from B1
			CollisionInfo.normal.x = 0-CollisionInfo.normal.x;
			CollisionInfo.normal.y = 0-CollisionInfo.normal.y;
		}

		float smallestD = 10000.0f; //Initialize the smallest distance to a large value

		for (int i=0; i<b1.vertexCount; i++) {
			// Measure the distance of the vertex from the line using the line equation
			// float Distance = CollisionInfo.Normal.multiplyVal( B1.Vertices[I].Position.minus(B2.Center) );
			xx = b1.vertices[i].position.x - b2.center.x;
			yy = b1.vertices[i].position.y - b2.center.y;
			float distance = CollisionInfo.normal.x * xx + CollisionInfo.normal.y * yy;

			if (distance < smallestD) { //If the measured distance is smaller than the smallest distance reported so far, set the smallest distance and the collision vertex
				smallestD = distance;
				CollisionInfo.v = b1.vertices[i];
			}
		}

		return true; //There is no separating axis. Report a collision!
	}
	
	private static void processCollision() {
		Vertex e1 = CollisionInfo.e.v1;
		Vertex e2 = CollisionInfo.e.v2;

		float collisionVectorX = CollisionInfo.normal.x * CollisionInfo.depth;
		float collisionVectorY = CollisionInfo.normal.y * CollisionInfo.depth;

		float t;
		if (Math.abs( e1.position.x - e2.position.x ) > Math.abs( e1.position.y - e2.position.y ) ) {
			t = ( CollisionInfo.v.position.x - collisionVectorX - e1.position.x )/(  e2.position.x - e1.position.x );
		}
		else {
			t = ( CollisionInfo.v.position.y - collisionVectorY - e1.position.y )/(  e2.position.y - e1.position.y );
		}

		float lambda = 1.0f/( t*t + ( 1 - t )*( 1 - t ) );
		float edgeMass = t*e2.parent.mass + ( 1f - t )*e1.parent.mass; //Calculate the mass at the intersection point
		float invCollisionMass = 1.0f/( edgeMass + CollisionInfo.v.parent.mass );

		float ratio1 = CollisionInfo.v.parent.mass*invCollisionMass;
		float ratio2 = edgeMass*invCollisionMass;

		e1.position.x -= collisionVectorX * (( 1 - t )*ratio1*lambda);
		e1.position.y -= collisionVectorY * (( 1 - t )*ratio1*lambda);
		e2.position.x -= collisionVectorX * (    t    *ratio1*lambda);
		e2.position.y -= collisionVectorY * (    t    *ratio1*lambda);
		
		CollisionInfo.v.position.x += collisionVectorX * ratio2;
		CollisionInfo.v.position.y += collisionVectorY * ratio2;
	}
	
	private static float IntervalDistance(float minA, float maxA, float minB, float maxB) {
		if (minA < minB) {
			return minB - maxA;
		}
		else {
			return minA - maxB;
		}
	}
	
	/**
	 * Used for optimization to test if the bounding boxes of two bodies overlap.
	 * @param B1
	 * @param B2
	 * @return
	 */
	private static boolean bodiesOverlap( PhysicsBody B1, PhysicsBody B2 ) {
		return ( B1.minX <= B2.maxX ) && ( B1.minY <= B2.maxY ) && ( B1.maxX >= B2.minX ) && ( B2.maxY >= B1.minY );
	}


	public void update() {
		updateForces();
		updateVerlet();
		iterateCollisions();
	}

	public void render(Graphics g) {
		g.setColor(Color.black);
		g.fillRect(0, 0, screenWidth, screenHeight);
		
		g.setColor(Color.red);

		for (int i = 0; i < edgeCount; i++ ) {
			g.drawLine( (int)edges[ i ].v1.position.x, (int)edges[ i ].v1.position.y, (int)edges[ i ].v2.position.x, (int)edges[ i ].v2.position.y );
		}

		g.setColor(Color.white);

		for (int i = 0; i < vertexCount; i++ ) {
			g.fillOval((int)vertices[ i ].position.x-2, (int)vertices[ i ].position.y-2, 4, 4);
		}
	}

	/**
	 * Adds new elements to the simulation
	 * @param Body
	 */
	public void addBody(PhysicsBody Body) {
		this.bodies[this.bodyCount++] = Body;
	}
	
	public void addEdge(Edge E) {
		this.edges[this.edgeCount++] = E;
	}

	public void addVertex(Vertex V) {
		this.vertices[this.vertexCount++] = V;
	}

	public Vertex findVertex( int X, int Y ) {
		Vertex nearestVertex = null;
		float minDistance = 1000.0f;

		Point2D.Float coords = new Point2D.Float( (float)X, (float)Y );

		for (int i = 0; i < vertexCount; i++ ) {
			float distance = (float)Math.hypot(vertices[ i ].position.x - coords.x, vertices[ i ].position.y - coords.y);

			if (distance < minDistance ) {
				nearestVertex = vertices[ i ];
				minDistance = distance;
			}
		}

		return nearestVertex;
	}

	public Physics(int width, int height) {
		this(width, height, 0, 0, 1);
	}

	public Physics(int width, int height, float GravitationX, float GravitationY, int pIterations) {
		this.screenWidth = width;
		this.screenHeight = height;
		this.bodyCount = 0;
		this.vertexCount = 0;
		this.edgeCount = 0;
		this.gravity = new Point2D.Float(GravitationX, GravitationY);
		this.iterations = pIterations;
		this.timestep = 1.0f;
	}
};
