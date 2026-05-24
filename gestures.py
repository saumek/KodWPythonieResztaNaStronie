import cv2
import mediapipe as mp
import math
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = vision.HandLandmarkerOptions(base_options=BaseOptions(model_asset_path='C:/Users/Dell/hand_landmarker.task'),
                                       num_hands=1, 
                                       running_mode=VisionRunningMode.VIDEO)

detector = vision.HandLandmarker.create_from_options(options)


def dist(a, b):
    return math.hypot(a.x - b.x, a.y - b.y)

def detect_gesture(hand):
    index_finger = hand[8]  #wskazujący
    thumb = hand[4]  #kciuk
    if dist(thumb, index_finger) < 0.05:
        return "KLIK"
    elif index_finger.x < 0.3:
        return "LEFT"
    return "NONE"

def gesture_loop():
    # kamera
    cap = cv2.VideoCapture(0)
    timestamp = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

        result = detector.detect_for_video(mp_image, timestamp)
        timestamp += 1

        if result.hand_landmarks:
            hand = result.hand_landmarks[0]

            gesture=detect_gesture(hand)
            if gesture!= "NONE":
                print(gesture)  
            
            # rysowanie (debug)
            for lm in hand:
                cx, cy = int(lm.x * w), int(lm.y * h)
                cv2.circle(frame, (cx, cy), 5, (0,255,0), -1)

        cv2.imshow("Mouse Control", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    gesture_loop()