package com.gmail.craigmit.verletdemo;

import java.awt.AWTEvent;
import java.awt.Event;
import java.awt.Graphics;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;

import javax.swing.JApplet;

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
@SuppressWarnings("serial")
public class MainApplet extends JApplet implements Runnable {
	static final int FPS = 30;
	static final int SECOND_TO_NANOSECOND = 1000000000;
	static final int SCREEN_WIDTH = 600;
	static final int SCREEN_HEIGHT = 450;
	
	/**
	 * The vertex that is currently dragged around with the mouse
	 */
	private Vertex dragVertex = null;
	
	/**
	 * The main physics world
	 */
	private Physics world = null;
	
	private int mouseX;
	private int mouseY;

	@Override
	public void start() {
		this.enableEvents(AWTEvent.MOUSE_EVENT_MASK | AWTEvent.MOUSE_MOTION_EVENT_MASK);
		new Thread(this).start();
	}
	
	@Override
	protected void processEvent(AWTEvent e) {
        switch (e.getID()) {
	        case Event.MOUSE_DOWN:
	        	// Set a new vertex to be dragged around if the left mouse button is hit
	        	if (e instanceof MouseEvent) {
	        		if (((MouseEvent)e).getButton() == 1) {
	        			dragVertex = world.findVertex(((MouseEvent)e).getX(), ((MouseEvent)e).getY());
		        		mouseX = ((MouseEvent)e).getX();
		        		mouseY = ((MouseEvent)e).getY();
	        		}
	        		else {
	        			new PhysicsBody(world, 1).createBox( world, ((MouseEvent)e).getX() - 20, ((MouseEvent)e).getY() - 30, 40, 60 );
	        		}
	        	}
	        	break;
	        case Event.MOUSE_UP:
	        	// Stop dragging the vertex
	        	dragVertex = null;
	        	break;
	        case Event.MOUSE_MOVE:
	        	break;
	        case Event.MOUSE_DRAG:
	        	if (e instanceof MouseEvent) {
	        		mouseX = ((MouseEvent)e).getX();
	        		mouseY = ((MouseEvent)e).getY();
	        	}
	        	break;
        }
	}

	private void initPhysics() {
		// Create a new physics instance with gravity pointing downwards and using 10 iterations
		world = new Physics(SCREEN_WIDTH, SCREEN_HEIGHT, 0.0f, 1f, 15 );
		
		for( int X = 20; X < SCREEN_WIDTH; X += 100 ) {
			for( int Y = 50; Y < SCREEN_HEIGHT - 50; Y += 100 ) {
				new PhysicsBody(world, 1).createBox( world, X, Y, 50, 50 ); //Create a few boxes
			}
		}

		for( int X = 50; X < SCREEN_WIDTH - 50; X += 130 ) {
			PhysicsBody Body = new PhysicsBody(world, 1); //Create a few triangles. Only boxes would get boring, right?
		
			Vertex V1 = new Vertex( world, Body, X      , 45 );
			Vertex V2 = new Vertex( world, Body, X +  50, 0  );
			Vertex V3 = new Vertex( world, Body, X + 100, 45 );
		
			new Edge( world, Body, V1, V2 );
			new Edge( world, Body, V2, V3 );
			new Edge( world, Body, V3, V1 );
		}
	}

	@Override
	public void run() {
		long lastFrame = 0; // The time we started calculating this frame
		setSize(SCREEN_WIDTH, SCREEN_HEIGHT); // For AppletViewer, remove later.
		
		// Set up the graphics stuff, double-buffering.
		BufferedImage screen = new BufferedImage(SCREEN_WIDTH, SCREEN_HEIGHT, BufferedImage.TYPE_INT_RGB);
		Graphics g = screen.getGraphics();
		Graphics appletGraphics = getGraphics();
		
		// Set up the physics
		initPhysics();

		// Wait until the graphics context is valid
        while(!isActive()) {
        	Thread.yield();
        }

        // Game loop.
		do {
			// Run at correct FPS
			do {
				try {
					Thread.sleep(1); // Give the EDT lots of time
				}
				catch (Throwable e) {}
			} while (System.nanoTime() < lastFrame + SECOND_TO_NANOSECOND/FPS);
			lastFrame = System.nanoTime();

			// Sets the position of the DragVertex to the mouse position to drag it around
        	if( dragVertex != null ) {
        		dragVertex.position.x = mouseX;
        		dragVertex.position.y = mouseY;
        	}
			
			// Update
			world.update();
			world.render(g);

			// Draw the entire results on the screen.
			appletGraphics.drawImage(screen, 0, 0, null);
			
		} while (this.isActive());
	}
}
