"use client";

import { useEffect } from "react";

interface HeadScriptItem {
  script: string;
  name?: string;
  id?: string;
}

interface DynamicScriptsProps {
  adsData: {
    parsedElement: {
      type: string;
      attributes: Record<string, string>;
    };
    script: string;
  }[];
  headScripts: HeadScriptItem[];
}

const DynamicScripts: React.FC<DynamicScriptsProps> = ({ adsData, headScripts }) => {
  useEffect(() => {
    adsData.forEach((ad) => {
      const { parsedElement, script } = ad;

      // Build selector
      const { type, attributes } = parsedElement;
      const selector = buildSelector(type, attributes);
      const targetElement = document.querySelector(selector);

      if (targetElement) {
        console.log("Target element found:", targetElement);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = script;

        // Handle <ins> elements
        const insTags = tempDiv.querySelectorAll("ins");
        insTags.forEach((insTag) => {
          // Remove existing <ins> if necessary
          const existingIns = targetElement.querySelector("ins.adsbygoogle");
          if (existingIns) targetElement.removeChild(existingIns);

          // Create and append new <ins>
          const newIns = document.createElement("ins");
          Array.from(insTag.attributes).forEach((attr) => {
            newIns.setAttribute(attr.name, attr.value);
          });
          targetElement.appendChild(newIns);

          // Initialize AdSense
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error("AdSense initialization error:", e);
          }
        });

        // Handle <script> elements
        const scriptTags = tempDiv.querySelectorAll("script");
        scriptTags.forEach((scriptTag) => {
          const newScript = document.createElement("script");
          if (scriptTag.src) {
            newScript.src = scriptTag.src;
            newScript.async = true;
          } else {
            newScript.textContent = scriptTag.textContent;
          }
          targetElement.appendChild(newScript);
        });
      } else {
        console.warn("Target element not found for:", parsedElement);
      }
    });
  }, [adsData]);
  useEffect(() => {
    headScripts.forEach((item) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = item.script;

      Array.from(tempDiv.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;

        switch (child.tagName.toLowerCase()) {
          case 'script':
            const scriptElement = document.createElement('script');
            if (isHTMLScriptElement(child)) {
              if (child.src) {
                scriptElement.src = child.src;
              }
              Array.from(child.attributes).forEach(attr => {
                scriptElement.setAttribute(attr.name, attr.value);
              });
              
              if (!child.src) {
                scriptElement.textContent = child.textContent || '';
              }
            }
            
            document.head.appendChild(scriptElement);
            break;
          
          case 'meta':
            const metaElement = document.createElement('meta');
            Array.from(child.attributes).forEach(attr => {
              metaElement.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(metaElement);
            break;
          
          case 'link':
            const linkElement = document.createElement('link');
            Array.from(child.attributes).forEach(attr => {
              linkElement.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(linkElement);
            break;
          
          default:
            console.warn(`Unsupported tag type: ${child.tagName}`);
        }
      });
    });
  }, [headScripts]);

  return null;
};

function isHTMLScriptElement(element: HTMLElement): element is HTMLScriptElement {
  return element.tagName.toLowerCase() === 'script';
}

// Helper function to build a CSS selector
const buildSelector = (type: string, attributes: Record<string, string>): string => {
  let selector = type;

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "className") {
      selector += `.${value.split(" ").join(".")}`;
    } else if (key === "id") {
      selector += `#${value}`;
    } else {
      selector += `[${key}="${value}"]`;
    }
  }

  return selector;
};

export default DynamicScripts;