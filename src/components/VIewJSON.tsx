"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronRight, Hash, AlignLeft, Box, Layers, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from "@/lib/utils" 

const getValueType = (value: any): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}


function JsonValue({ value, indentLevel = 0}: { value: any, indentLevel?: number }) {
  const type = getValueType(value);
  const valueStyles = {
    string: "text-green-500 dark:text-green-400",
    number: "text-blue-500 dark:text-blue-400",
    boolean: "text-purple-500 dark:text-purple-400",
    null: "text-gray-500 dark:text-gray-400",
    undefined: "text-gray-500 dark:text-gray-400",
    object: "text-foreground ",
    array: "text-foreground",
  };

  if (type === 'array' && value.length > 0) {
    return (
      <JsonArray array={value} indentLevel={indentLevel}   />
    );
  } else if (type === 'object' && value !== null && Object.keys(value).length > 0) {
    return (
      <JsonObject object={value} indentLevel={indentLevel} />
    );
  } else if (type === 'array' && value.length === 0) {
    return <span className="text-foreground opacity-70">[ ]</span>;
  } else if (type === 'object' && Object.keys(value).length === 0) {
    return <span className="text-foreground opacity-70">{ }</span>;
  } else if (type === 'string') {
    return <span className={valueStyles.string}>"{value}"</span>;
  } else if (type === 'boolean') {
    return (
      <span className="flex items-center gap-1">
        {value ? 
          <ToggleRight className="h-4 w-4 inline text-purple-500 dark:text-purple-400" /> : 
          <ToggleLeft className="h-4 w-4 inline text-purple-500 dark:text-purple-400" />}
        <span className={valueStyles.boolean}>{String(value)}</span>
      </span>
    );
  } else if (type === 'null') {
    return <span className={valueStyles.null}>null</span>;
  } else {
    return <span className={valueStyles[type as keyof typeof valueStyles]}>{String(value)}</span>;
  }
}

function JsonObject({ object, indentLevel = 0 }: { object: Record<string, any>, indentLevel?: number }) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const keys = Object.keys(object);

  const handleToggleExpand = (key: string) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="pl-2 border-l border-border/30">
      {keys.map((key) => {
        const value = object[key];
        const valueType = getValueType(value);
        const isExpandable = 
          (valueType === 'object' && value !== null && Object.keys(value).length > 0) || 
          (valueType === 'array' && value.length > 0);
        const isExpanded = expandedKeys[key];

        return (
          <motion.div 
            key={key} 
            className="py-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={cn(
                "flex items-start gap-2", 
                isExpandable ? "cursor-pointer hover:bg-accent/20 rounded" : ""
              )}
              onClick={isExpandable ? () => handleToggleExpand(key) : undefined}
            >
              {isExpandable ? (
                isExpanded ? 
                  <ChevronDown className="h-4 w-4 mt-1 text-muted-foreground" /> : 
                  <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
              ) : (
                <span className="w-4" />
              )}

              <div className="flex-1">
                <span className="font-semibold text-amber-500 dark:text-amber-400">{key}</span>
                <span className="text-muted-foreground mx-1">:</span>
                
                {isExpandable ? (
                  <span className="flex items-center gap-1 text-muted-foreground ml-1">
                    {valueType === 'array' ? (
                      <>
                        <Layers className="h-3 w-3" />
                        <span>Array[{value.length}]</span>
                      </>
                    ) : (
                      <>
                        <Box className="h-3 w-3" />
                        <span>Object{"{}"}</span>
                      </>
                    )}
                  </span>
                ) : (
                  <JsonValue value={value} />
                )}
              </div>
            </div>

            {isExpandable && isExpanded && (
              <motion.div 
                className="ml-6 mt-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <JsonValue value={value} indentLevel={indentLevel + 1} />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function JsonArray({ array, indentLevel = 0}: { array: any[], indentLevel?: number }) {
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});

  const handleToggleExpand = (index: number) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
 

  return (
    <div className="pl-2 border-l border-border/30">
      {array.map((item, index) => {
        const valueType = getValueType(item);
        const isExpandable = 
          (valueType === 'object' && item !== null && Object.keys(item).length > 0) || 
          (valueType === 'array' && item.length > 0);
        const isExpanded = expandedIndices[index];

        return (
          <motion.div 
            key={index} 
            className="py-1 border border-black/40 dark:border-white/10 bg-white dark:bg-black shadow-sm rounded-md p-2 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={cn(
                "flex items-start gap-2", 
                isExpandable ? "cursor-pointer hover:bg-accent/20 rounded" : ""
              )}
              onClick={isExpandable ? () => handleToggleExpand(index) : undefined}
            >
              {isExpandable ? (
                isExpanded ? 
                  <ChevronDown className="h-4 w-4 mt-1 text-muted-foreground" /> : 
                  <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
              ) : (
                <span className="w-4" />
              )}

              <div className="flex-1">
                <span className="font-medium text-blue-500 dark:text-blue-400">[{index}]</span>
                <span className="text-muted-foreground mx-1">:</span>
                {isExpandable ? (
                  <span className="flex items-center gap-1 text-muted-foreground ml-1">
                    {valueType === 'array' ? (
                      <>
                        <Layers className="h-3 w-3" />
                        <span>Array[{item.length}]</span>
                      </>
                    ) : (
                      <>
                        <Box className="h-3 w-3" />
                        <span>Object{"{}"}</span>
                      </>
                    )}
                  </span>
                ) : (
                  <JsonValue value={item} />
                )}
              </div>
            </div>

            {isExpandable && isExpanded && (
              <motion.div 
                className="ml-6 mt-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <JsonValue value={item} indentLevel={indentLevel + 1} />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function ViewJSON({dataContent}: any) {
  let parsedData: any;
  let hasError = false;
  try {
    parsedData = JSON.parse(dataContent);
  } catch (err) {
    parsedData = dataContent;
    hasError = true;
  }

  return (
    <div className="rounded-md border border-black/40 dark:border-white/10 bg-white dark:bg-black shadow-sm p-4">
      {hasError ? (
        <div className="text-red-500 p-2 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20">
          <p className="font-medium">Error to parse JSON</p>
          <pre className="text-sm mt-2 overflow-auto">{dataContent}</pre>
        </div>
      ) : (
        <ScrollArea className="h-[95vh] w-full pr-4">
          <div className="font-mono text-sm p-2">
            {Array.isArray(parsedData) ? (
              <div className="flex items-center gap-1 mb-2 text-muted-foreground">
                <Layers className="h-4 w-4" /> 
                <span>Main array [{parsedData.length} elements]</span>
              </div>
            ) : typeof parsedData === 'object' && parsedData !== null ? (
              <div className="flex items-center gap-1 mb-2 text-muted-foreground">
                <Box className="h-4 w-4" /> 
                <span>Object Principal{"{}"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-2 text-muted-foreground">
                {typeof parsedData === 'string' ? (
                  <AlignLeft className="h-4 w-4" />
                ) : typeof parsedData === 'number' ? (
                  <Hash className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4" />
                )}
                <span>Value {typeof parsedData}</span>
              </div>
            )}
            <JsonValue value={parsedData} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default ViewJSON