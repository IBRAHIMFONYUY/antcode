import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, Mic, MicOff, VideoOff, Phone, Info } from 'lucide-react';
import { useState } from 'react';

interface VideoCallProps {
  bookingId: string;
  mentorName: string;
  sessionTime: Date;
  onEndCall: () => void;
}

export function VideoCall({ bookingId, mentorName, sessionTime, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Video integration is being set up. For now, you can coordinate meeting outside the app or use a video provider like Google Meet.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Session with {mentorName}</CardTitle>
          <CardDescription>Started at {sessionTime.toLocaleTimeString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video containers would go here */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">Your Video</p>
              </div>
            </div>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">{mentorName}'s Video</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              size="lg"
              variant={isMuted ? 'destructive' : 'default'}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>

            <Button
              size="lg"
              variant={!isVideoOn ? 'destructive' : 'default'}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {!isVideoOn ? <VideoOff className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
              {!isVideoOn ? 'Start Video' : 'Stop Video'}
            </Button>

            <Button
              size="lg"
              variant="destructive"
              onClick={onEndCall}
            >
              <Phone className="h-4 w-4 mr-2 rotate-180" />
              End Call
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Your session will be recorded for quality assurance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
