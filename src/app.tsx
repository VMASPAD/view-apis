import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "preact/hooks";
import ViewJSON from "./components/VIewJSON";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { Moon, Sun } from "lucide-react";

export function App() {
  const [first, setFirst] = useState("");
  const [fetchResult, setFetchResult] = useState<any>([]);
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Load URL history from localStorage on page load
    const storedHistory = localStorage.getItem("urlHistory");
    if (storedHistory) {
      setUrlHistory(JSON.parse(storedHistory));
    }

    // Apply the initial theme
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const fetchData = async (url?: string) => {
    const targetUrl = url || first;
    if (!targetUrl) {
      toast.error("Please enter a URL.");
      return;
    }

    toast.info("Fetching data...");
    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        toast.error("Fetch failed.");
        throw new Error("Network response was not ok");
      }
      toast.success("Data fetched successfully!");
      const data = await response.json();
      setFetchResult(JSON.stringify(data));

      // Add URL to history if it's not already present
      setUrlHistory((prev) => {
        const updatedHistory = prev.includes(targetUrl) ? prev : [targetUrl, ...prev];
        localStorage.setItem("urlHistory", JSON.stringify(updatedHistory)); // Save to localStorage
        return updatedHistory;
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center gap-5">
          <Input
            type="text"
            placeholder="URL"
            value={first}
            onChange={(e) => setFirst((e.target as HTMLInputElement).value)}
            className={"flex-1/2"}
          />
          <Button className=" " onClick={() => fetchData()}>Submit</Button>
        <Button onClick={toggleTheme}>
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>
      </div>

      <Tabs defaultValue="viewer" className="w-full">
        <TabsList>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="viewer">
          <ViewJSON dataContent={fetchResult} />
          {urlHistory.length > 0 && (
            <div className="border border-muted rounded-md p-4 bg-muted/10">
              <h3 className="font-semibold text-muted-foreground mb-2">URL History</h3>
              <ul className="space-y-2">
                {urlHistory.map((url, index) => (
                  <li key={index}>
                    <Button
                      variant="link"
                      className="text-blue-500 underline"
                      onClick={() => fetchData(url)}
                    >
                      {url}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="my-3">JSON parsed:</p>
          <Textarea
            placeholder="Results..."
            value={fetchResult}
            readOnly
            className="font-mono"
          />
        </TabsContent>
        <TabsContent value="editor">
          <Editor
            className="h-[87vh] rounded-xl overflow-auto"
            value={fetchResult}
            language="json"
            theme={isDarkMode ? "vs-dark" : "light"}
            defaultLanguage="json"
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
