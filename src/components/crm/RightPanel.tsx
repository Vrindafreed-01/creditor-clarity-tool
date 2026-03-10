import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import RequestDetailsModal from "./RequestDetailsModal";
import RequestDocumentsModal from "./RequestDocumentsModal";

const RightPanel = () => {
  const [noteText, setNoteText] = useState("");
  const [requestDetailsOpen, setRequestDetailsOpen] = useState(false);
  const [requestDocumentsOpen, setRequestDocumentsOpen] = useState(false);

  const notes = [
    "Call Nature : Manual-Outbound| Call start time: 2025-03-10 10:30",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-09 14:15",
    "Call Nature : Manual-Outbound| Call start time: 2025-03-08 11:45",
  ];

  const handleAddNote = () => {
    if (noteText.trim()) {
      setNoteText("");
    }
  };

  return (
    <aside className="sticky top-0 h-screen w-[300px] bg-card border-l overflow-y-auto shrink-0 z-30">
      <div className="p-4 space-y-4">
        {/* Sales Rep */}
        <Card className="shadow-none">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sales Rep :</span>
              <Badge variant="outline" className="text-xs font-normal border-primary text-primary">
                chandan.pandey
              </Badge>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm text-muted-foreground">RM :</span>
              <span className="text-sm text-muted-foreground">—</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card className="shadow-none">
          <Tabs defaultValue="active">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <TabsList className="h-7 p-0.5 bg-muted">
                  <TabsTrigger value="active" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Completed</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm text-muted-foreground text-center py-3">No Task to display</p>
            </CardContent>
          </Tabs>
        </Card>

        {/* Select Actions */}
        <Card className="shadow-none">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Select>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Select Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request-details">Request Details</SelectItem>
                  <SelectItem value="request-docs">Request Documents</SelectItem>
                  <SelectItem value="request-scrub">Request Scrub</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="text-[10px] cursor-pointer">All</Badge>
            </div>
            <div className="border-t pt-2">
              <span className="text-sm font-medium">Assign Sales Rep</span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shadow-none">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
              <Tabs defaultValue="notes">
                <TabsList className="h-7 p-0.5 bg-muted">
                  <TabsTrigger value="notes" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Notes</TabsTrigger>
                  <TabsTrigger value="highlighted" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Highlighted</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="relative">
              <Textarea
                placeholder="Add Note (Ctrl + Enter)"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[60px] pr-10 text-xs resize-none bg-muted/50"
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") handleAddNote();
                }}
              />
              <button
                onClick={handleAddNote}
                className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-0">
              {notes.map((note, i) => (
                <div key={i} className="py-2 border-b last:border-0">
                  <p className="text-xs text-muted-foreground truncate">{note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="shadow-none">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <Badge variant="secondary" className="text-[10px] cursor-pointer">All</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="aadhar">Aadhar Card</SelectItem>
                <SelectItem value="salary-slip">Salary Slip</SelectItem>
                <SelectItem value="bank-statement">Bank Statement</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-xs text-muted-foreground cursor-pointer hover:bg-accent transition-colors">
              <Paperclip className="h-3.5 w-3.5" />
              Document File
            </div>
            <Button variant="outline" size="sm" className="w-full text-xs" disabled>
              Upload
            </Button>
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card className="shadow-none">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Tickets</CardTitle>
              <Tabs defaultValue="active">
                <TabsList className="h-7 p-0.5 bg-muted">
                  <TabsTrigger value="active" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Completed</TabsTrigger>
                  <TabsTrigger value="subscribed" className="text-[10px] px-2 h-6 data-[state=active]:bg-card">Subscribed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-sm text-muted-foreground text-center py-3">No Tickets to display</p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default RightPanel;
