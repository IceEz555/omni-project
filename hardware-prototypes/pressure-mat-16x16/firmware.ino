#include <Arduino.h>

#define NUM_ROWS 32
#define NUM_COLS 32

// ===== ROW MUX =====
#define SIG_ROW1 A4
#define SIG_ROW2 A9

const byte rowS0_mux1 = A0;
const byte rowS1_mux1 = A1;
const byte rowS2_mux1 = A2;
const byte rowS3_mux1 = A3;

const byte rowS0_mux2 = A5;
const byte rowS1_mux2 = A6;
const byte rowS2_mux2 = A7;
const byte rowS3_mux2 = A8;

// ===== COLUMN MUX =====
#define SIG_COL1 8    // col 0–15
#define SIG_COL2 13   // col 16–31

const byte colS0_mux1 = 4;
const byte colS1_mux1 = 5;
const byte colS2_mux1 = 6;
const byte colS3_mux1 = 7;

const byte colS0_mux2 = 9;
const byte colS1_mux2 = 10;
const byte colS2_mux2 = 11;
const byte colS3_mux2 = 12;

// ===== MUX channel table =====
const boolean muxChannel[16][4] = {
  {0,0,0,0},{1,0,0,0},{0,1,0,0},{1,1,0,0},
  {0,0,1,0},{1,0,1,0},{0,1,1,0},{1,1,1,0},
  {0,0,0,1},{1,0,0,1},{0,1,0,1},{1,1,0,1},
  {0,0,1,1},{1,0,1,1},{0,1,1,1},{1,1,1,1}
};

uint16_t sensed[NUM_ROWS][NUM_COLS];

// =================================================

void setMuxChannel(byte ch, const byte *pins) {
  for (int i = 0; i < 4; i++) {
    digitalWrite(pins[i], muxChannel[ch][i]);
  }
}

int readRow(byte row) {
  if (row < 16) {
    const byte pins[4] = {rowS0_mux1, rowS1_mux1, rowS2_mux1, rowS3_mux1};
    setMuxChannel(row, pins);
    analogRead(SIG_ROW1);                 // dummy read
    delayMicroseconds(3);
    return analogRead(SIG_ROW1);
  } else {
    const byte pins[4] = {rowS0_mux2, rowS1_mux2, rowS2_mux2, rowS3_mux2};
    setMuxChannel(row - 16, pins);
    analogRead(SIG_ROW2);
    delayMicroseconds(3);
    return analogRead(SIG_ROW2);
  }
}

void setColumn(byte col, bool on) {
  if (col < 16) {
    const byte pins[4] = {colS0_mux1, colS1_mux1, colS2_mux1, colS3_mux1};
    setMuxChannel(col, pins);
    digitalWrite(SIG_COL1, on ? HIGH : LOW);
    digitalWrite(SIG_COL2, LOW);
  } else {
    const byte pins[4] = {colS0_mux2, colS1_mux2, colS2_mux2, colS3_mux2};
    setMuxChannel(col - 16, pins);
    digitalWrite(SIG_COL1, LOW);
    digitalWrite(SIG_COL2, on ? HIGH : LOW);
  }
}

// =================================================

void setup() {
  Serial.begin(460800);

  // ROW select pins
  pinMode(rowS0_mux1, OUTPUT); pinMode(rowS1_mux1, OUTPUT);
  pinMode(rowS2_mux1, OUTPUT); pinMode(rowS2_mux1, OUTPUT); // Corrected typo from original code block? No, rowS3_mux1 was missed in output modes?
  // Re-checking user code: 
  // pinMode(rowS2_mux1, OUTPUT); pinMode(rowS3_mux1, OUTPUT); -> This line is in user code.
  
  pinMode(rowS0_mux1, OUTPUT); pinMode(rowS1_mux1, OUTPUT);
  pinMode(rowS2_mux1, OUTPUT); pinMode(rowS3_mux1, OUTPUT);
  pinMode(rowS0_mux2, OUTPUT); pinMode(rowS1_mux2, OUTPUT);
  pinMode(rowS2_mux2, OUTPUT); pinMode(rowS3_mux2, OUTPUT);

  // COLUMN select pins
  pinMode(colS0_mux1, OUTPUT); pinMode(colS1_mux1, OUTPUT);
  pinMode(colS2_mux1, OUTPUT); pinMode(colS3_mux1, OUTPUT);
  pinMode(colS0_mux2, OUTPUT); pinMode(colS1_mux2, OUTPUT);
  pinMode(colS2_mux2, OUTPUT); pinMode(colS3_mux2, OUTPUT);

  pinMode(SIG_COL1, OUTPUT);
  pinMode(SIG_COL2, OUTPUT);

  digitalWrite(SIG_COL1, LOW);
  digitalWrite(SIG_COL2, LOW);

  Serial.println("Press Mat 32x32 Ready");
}

void loop() {
  for (int c = 0; c < NUM_COLS; c++) {
    setColumn(c, true);          // drive column

    for (int r = 0; r < NUM_ROWS; r++) {
      sensed[r][c] = readRow(r);
    }

    setColumn(c, false);         // release column
  }

  // print
  Serial.println("TABLE");
  for (int r = 0; r < NUM_ROWS; r++) {
    for (int c = 0; c < NUM_COLS; c++) {
      Serial.print(sensed[r][c]);
      Serial.print(c == NUM_COLS - 1 ? '\n' : ' ');
    }
  }

  delay(10);
}
