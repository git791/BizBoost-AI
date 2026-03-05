import speech_recognition as sr
from pydub import AudioSegment
import os

def transcribe_local(file_path):
    # Convert mp4 to wav
    print("⏳ Converting audio...")
    audio = AudioSegment.from_file(file_path)
    wav_path = "temp_audio.wav"
    audio.export(wav_path, format="wav")
    
    # Transcribe using Google free API
    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio_data = recognizer.record(source)
    
    print("⏳ Transcribing...")
    text = recognizer.recognize_google(audio_data, language="hi-IN")
    os.remove(wav_path)
    return text

transcript = transcribe_local("sample_hindi.mp4")
print(f"\n🎤 You said: {transcript}")
