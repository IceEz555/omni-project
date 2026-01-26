#define NUM_ROWS 16
#define NUM_COLS 16

//ANALOG
#define SIG_PIN A0

//ROW MUX (OUTPUT → 5V)
#define ROW_S0 10
#define ROW_S1 11
#define ROW_S2 12
#define ROW_S3 13

//COL MUX (INPUT → A0)
#define COL_S0 6
#define COL_S1 7
#define COL_S2 8
#define COL_S3 9

int mat[NUM_ROWS][NUM_COLS];

const byte muxChannel[16][4] = {
  {0,0,0,0},{1,0,0,0},{0,1,0,0},{1,1,0,0},
  {0,0,1,0},{1,0,1,0},{0,1,1,0},{1,1,1,0},
  {0,0,0,1},{1,0,0,1},{0,1,0,1},{1,1,0,1},
  {0,0,1,1},{1,0,1,1},{0,1,1,1},{1,1,1,1}
};

void setup() {
  pinMode(ROW_S0, OUTPUT);
  pinMode(ROW_S1, OUTPUT);
  pinMode(ROW_S2, OUTPUT);
  pinMode(ROW_S3, OUTPUT);

  pinMode(COL_S0, OUTPUT);
  pinMode(COL_S1, OUTPUT);
  pinMode(COL_S2, OUTPUT);
  pinMode(COL_S3, OUTPUT);

  Serial.begin(115200);
  delay(1000);
  Serial.println("READY");
}

void loop() {
  readMat();
  printTable();
  delay(300);
}

void readMat() {
  for (int r = 0; r < NUM_ROWS; r++) {
    setRow(r);
    delayMicroseconds(80);

    for (int c = 0; c < NUM_COLS; c++) {
      setCol(c);
      delayMicroseconds(80);
      mat[r][c] = analogRead(SIG_PIN);
    }
  }
}

void setRow(int ch) {
  digitalWrite(ROW_S0, muxChannel[ch][0]);
  digitalWrite(ROW_S1, muxChannel[ch][1]);
  digitalWrite(ROW_S2, muxChannel[ch][2]);
  digitalWrite(ROW_S3, muxChannel[ch][3]);
}

void setCol(int ch) {
  digitalWrite(COL_S0, muxChannel[ch][0]);
  digitalWrite(COL_S1, muxChannel[ch][1]);
  digitalWrite(COL_S2, muxChannel[ch][2]);
  digitalWrite(COL_S3, muxChannel[ch][3]);
}

void printTable() {
  Serial.println("TABLE");
  for (int r = 0; r < NUM_ROWS; r++) {
    for (int c = 0; c < NUM_COLS; c++) {
      Serial.print(mat[r][c]);
      if (c < NUM_COLS - 1) Serial.print(" ");
    }
    Serial.println();
  }
}
