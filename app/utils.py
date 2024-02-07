import time

class Stopwatch:
    def __init__(self):
        self.startTime = None
        self.elapsedTime = 0
        self.isRunning = False

    def startWatch(self):
        if not self.isRunning:
            self.startTime = time.time()
            self.isRunning = True
            print("Stopwatch has started")
    
    def stopWatch(self):
        if self.isRunning:
            self.elapsedTime = time.time() - self.startTime
            self.isRunning = False
            print("Stopwatch has stopped")

    def resetWatch(self):
        elapsed = self.elapsedTime
        self.elapsedTime = 0
        self.isRunning = False
        self.startTime = None
        minutes = int(elapsed // 60)
        seconds = int(elapsed % 60)
        elapsed_time_formatted = f"{minutes:02d}:{seconds:02d}"
        print(f"Time: {elapsed_time_formatted}")
        return elapsed_time_formatted