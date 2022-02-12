package com.gmail.craigmit.verletdemo;

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
public class Edge {
	Vertex v1;
	Vertex v2;
	float length;
	boolean boundary; //Value used for optimization - see Physics::DetectCollision for more information
	PhysicsBody parent;

	public Edge( Physics world, PhysicsBody body, Vertex pV1, Vertex pV2) {
		this(world, body, pV1, pV2, true);
	}

	public Edge( Physics world, PhysicsBody body, Vertex pV1, Vertex pV2, boolean pBoundary) {
		v1 = pV1; //Set boundary vertices
		v2 = pV2;

		length   = (float)Math.hypot(pV2.position.x - pV1.position.x, pV2.position.y - pV1.position.y); //Calculate the original length
		boundary = pBoundary;

		parent = body;

		body.addEdge( this ); //Add the edge to the given body and to the physics simulator
		world.addEdge( this );
	}
};
