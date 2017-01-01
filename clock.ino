/*
 * clock with
 * 16 segment displays via SPI

 */

#include <Time.h>
#include <avr/pgmspace.h>

#define TIME_MSG_LEN  11   // time sync to PC is HEADER followed by Unix time_t as ten ASCII digits
#define TIME_HEADER  'T'   // Header tag for serial time sync message
//#define TIME_REQUEST  7    // ASCII bell character requests a time sync message 


int ledPin =  9;    // LED connected to digital pin 13

//Pin connected to ST_CP (pin 12)of 74HC595
int latchPin = 6;
//Pin connected to SH_CP (pin 11) of 74HC595
int clockPin = 4;
////Pin connected to DS (pin 14) of 74HC595
int dataPin = 5;

// Segment bit order is A1 A2 B C D1 D2 E F G1 G2 H I J K L M


const uint16_t uiCharacterMap[96] PROGMEM =
  {
    // SPACE ! " # $ % & '
    0x0000, 0x0300, 0x0110, 0x0fd2, 0xddd2, 0x95db, 0x8eb4, 0x0010,
    // ( ) * + , - . /
    0x000c, 0x0021, 0x00ff, 0x00d2, 0x0001, 0x00c0, 0x0004, 0x0009,
    //  0 1 2 3 4 5 6 7
  0xff09, 0x3008, 0xec41, 0xdc48, 0x01d2, 0xcd84, 0x1fc0, 0xc00a,
  // 8 9 : ; < = > ?
  0xffc0, 0xf1c0, 0x8080, 0x8081, 0x0c09, 0xc0c0, 0x0c24, 0xe142,
    // @ A B C D E F G
  0xfe83, 0x3049, 0xfc52, 0xcf00, 0xfc12, 0xcfc0, 0xc3c0, 0xdf40,
  // H I J K L M N O
  0x33c0, 0xcc12, 0x3e00, 0x038c, 0x0f00, 0x3328, 0x3324, 0xff00,
  // P Q R S T U V W
  0xe3c0, 0xff04, 0xe3c4, 0xddc0, 0xc012, 0x3f00, 0x0309, 0x3305,
  // X Y Z [ | ] ^ _
  0x002d, 0x002a, 0xcc09, 0x8b00, 0x0024, 0x7400, 0x0120, 0x0c00,
  // ` a b c d e f g
  0x0020, 0x8e92, 0x0b82, 0x0a80, 0x0e92, 0x0a81, 0x40d2, 0x8992,
  // h i j k l m n o
  0x0382, 0x0a00, 0x0812, 0x001e, 0x0412, 0x12c2, 0x0282, 0x0a82,
  // p q r s t u v w
  0x8390, 0x8192, 0x0280, 0x0444, 0x04d2, 0x0e02, 0x0201, 0x1e02,
  // x y z { | } ~ DEL
  0x002d, 0x3450, 0x0881, 0x4492, 0x0012, 0x8852, 0x0128, 0x00ff
  };

// Special characters
// 10  11  12  13  14  15  16  17  18  19
// 0x7712, 0x3300, 0x6742, 0x7740, 0x3350, 0x5750, 0x1752, 0x7300, 0x7752, 0x7350,

// The setup() method runs once, when the sketch starts
void setup()   {

    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH); // LED off, don need this here

    pinMode(latchPin, OUTPUT);
    pinMode(clockPin, OUTPUT);
    pinMode(dataPin, OUTPUT);

    Serial.begin(38400);
}


void latchDisable(void)
{
    digitalWrite(latchPin, LOW);
}

void latchEnable(void) {
  digitalWrite(latchPin, HIGH);
}

// Send one character

void sendOne(uint16_t i) {
  uint16_t a;
  
  a=pgm_read_word_near(&(uiCharacterMap[i-32]));
  shiftOut(dataPin, clockPin, LSBFIRST, 0xff^a);
  shiftOut(dataPin, clockPin, LSBFIRST, 0xff^(a>>8));
}

void sendString(char *s) {
  while (*s) {
    sendOne((uint16_t)*s++);
  }
}

void displayString(char *s) {
  latchDisable();
  sendString(s);
  latchEnable();
}


// the loop() method runs over and over again,
// as long as the Arduino has power


void loop(){    
  if(Serial.available() )  {
    processSyncMessage();
    } 
 
   if(timeStatus() == timeNotSet) 
    displayString(" SYNC?");
  else
    digitalClockDisplay();  

  delay(1000);
}

void sendNumber(uint16_t n, char filler) {
  if (n<10) {
    sendOne(filler);
  } else {
    sendOne(n/10+'0');
  }
  sendOne(n%10+'0');
}
  
void digitalClockDisplay(){
  // digital clock display of the time
  latchDisable();
  sendNumber(hour(), ' ');
  sendNumber(minute(), '0');
  sendNumber(second(), '0');
  latchEnable();
}

void processSyncMessage() {
  // if time sync available from serial port, update time and return true
  while(Serial.available() >=  TIME_MSG_LEN ){  // time message consists of header & 10 ASCII digits
    char c = Serial.read() ; 
    if( c == TIME_HEADER ) {       
      time_t pctime = 0;
      for(int i=0; i < TIME_MSG_LEN -1; i++){   
        c = Serial.read();          
        if( c >= '0' && c <= '9'){   
          pctime = (10 * pctime) + (c - '0') ; // convert digits to a number    
        }
      }   
      setTime(pctime);   // Sync Arduino clock to the time received on the serial port
    }  
  }
}
