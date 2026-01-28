import pygame
from serial import Serial
import sys
import time

#SERIAL
SERIAL_PORT = "COM5" # CHECK THIS PORT
BAUDRATE = 460800

#MAT
ROWS = 32
COLS = 32

#PYGAME
WIN_SIZE = 640
CELL_SIZE = WIN_SIZE // COLS

pygame.init()
screen = pygame.display.set_mode((WIN_SIZE, WIN_SIZE))
pygame.display.set_caption("16x16 Pressure Mat")
font = pygame.font.SysFont(None, 24)

#OPEN SERIAL
try:
    ser = Serial(SERIAL_PORT, BAUDRATE, timeout=1)
    time.sleep(2) 
except Exception as e:
    print(f"Error opening serial port {SERIAL_PORT}: {e}")
    print("Please check your COM port in the script.")
    sys.exit(1)

mat = [[0]*COLS for _ in range(ROWS)]
baseline = [[0]*COLS for _ in range(ROWS)]


def read_matrix():
    global mat

    # Try to read until we find TABLE or run out of buffer
    while ser.in_waiting:
        line = ser.readline().decode(errors="ignore").strip()
        if line == "TABLE":
            new_mat = []
            valid_read = True
            for _ in range(ROWS):
                row_line = ser.readline().decode(errors="ignore").strip()
                row = row_line.split()
                if len(row) != COLS:
                    valid_read = False
                    break
                try:
                    new_mat.append([int(v) for v in row])
                except ValueError:
                    valid_read = False
                    break
            
            if valid_read and len(new_mat) == ROWS:
                mat = new_mat
                return True
    return False


def calibrate(samples=30):
    global baseline
    print("Calibrating...")

    temp = [[0]*COLS for _ in range(ROWS)]
    collected = 0

    while collected < samples:
        # We need to force reads here
        line = ser.readline().decode(errors="ignore").strip()
        if line == "TABLE":
            new_mat = []
            valid = True
            for _ in range(ROWS):
                r_line = ser.readline().decode(errors="ignore").strip().split()
                if len(r_line) == COLS:
                    new_mat.append([int(v) for v in r_line])
                else:
                    valid = False
            
            if valid and len(new_mat) == ROWS:
                mat = new_mat
                for r in range(ROWS):
                    for c in range(COLS):
                        temp[r][c] += mat[r][c]
                collected += 1
                print(f"Calibrating: {collected}/{samples}")
        
        pygame.event.pump() # Keep window alive
        pygame.time.delay(10)

    for r in range(ROWS):
        for c in range(COLS):
            baseline[r][c] = temp[r][c] // samples

    print("Calibration done")


def draw_mat():
    max_force = 600   
    threshold = 20    

    for r in range(ROWS):
        for c in range(COLS):
            raw = mat[r][c]
            v = raw - baseline[r][c]

            if v < threshold:
                v = 0

            v = min(max_force, v)
            intensity = int((v / max_force) * 255)

            # Draw blue background with purple/red heat
            # Low = Blue (0,0,255), High = Red (255,0,0) or your specific color map
            # User image shows Blue background, with Purple/Red active blocks
            
            # Simple gradient: Blue to Red
            # r: 0 -> 255
            # b: 255 -> 0
            # g: 0
            
            # The User's Code Logic: color = (intensity, 0, 255 - intensity)
            # This makes 0 intensity = (0, 0, 255) [Blue]
            # Max intensity = (255, 0, 0) [Red]
            # Mid = Purple
            
            color = (intensity, 0, 255 - intensity)

            pygame.draw.rect(
                screen,
                color,
                (c * CELL_SIZE,
                 r * CELL_SIZE,
                 CELL_SIZE - 1, # Small gap for grid effect
                 CELL_SIZE - 1)
            )

clock = pygame.time.Clock()

# Run Loop
print("Starting Application...")
calibrate()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if read_matrix():
        # Only redraw when we get new data? Or always?
        pass

    screen.fill((0, 0, 0))
    draw_mat()

    pygame.display.flip()
    clock.tick(60)

ser.close()
pygame.quit()
sys.exit()
