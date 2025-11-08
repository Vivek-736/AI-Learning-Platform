'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            logLevel: 'fatal',
            suppressErrorRendering: true,
            themeVariables: {
                primaryColor: '#4f46e5',
                primaryTextColor: '#1f2937',
                primaryBorderColor: '#6366f1',
                lineColor: '#6366f1',
                secondaryColor: '#e0e7ff',
                tertiaryColor: '#f3f4f6',
                background: '#ffffff',
                mainBkg: '#ffffff',
                secondBkg: '#f3f4f6',
                tertiaryBkg: '#e5e7eb',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
            },
            flowchart: {
                curve: 'basis',
                padding: 20,
            },
        });
        
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) return;

        const renderDiagram = async () => {
            if (containerRef.current && chart) {
                containerRef.current.innerHTML = '';
                
                const cleanedChart = chart.trim();
                
                const isMermaid = cleanedChart.startsWith('graph') || 
                                  cleanedChart.startsWith('flowchart') ||
                                  cleanedChart.startsWith('sequenceDiagram') ||
                                  cleanedChart.startsWith('classDiagram') ||
                                  cleanedChart.startsWith('stateDiagram') ||
                                  cleanedChart.startsWith('erDiagram') ||
                                  cleanedChart.startsWith('gantt') ||
                                  cleanedChart.startsWith('pie');

                if (!isMermaid) {
                    const pre = document.createElement('pre');
                    pre.style.fontFamily = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';
                    pre.style.fontSize = '14px';
                    pre.style.lineHeight = '1.6';
                    pre.style.color = '#1f2937';
                    pre.style.whiteSpace = 'pre';
                    pre.style.overflowX = 'auto';
                    pre.style.padding = '20px';
                    pre.style.margin = '0';
                    pre.textContent = cleanedChart;
                    containerRef.current.appendChild(pre);
                    return;
                }

                try {
                    const { svg } = await mermaid.render(idRef.current, cleanedChart);
                    containerRef.current.innerHTML = svg;
                    
                    const errorDivs = document.querySelectorAll('div[id^="d"]');
                    errorDivs.forEach(div => {
                        if (div.textContent?.includes('Syntax error') || 
                            div.textContent?.includes('Parse error')) {
                            div.remove();
                        }
                    });
                } catch (error) {
                    console.warn('Mermaid syntax error, rendering as text:', error);
                    const pre = document.createElement('pre');
                    pre.style.fontFamily = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace';
                    pre.style.fontSize = '14px';
                    pre.style.lineHeight = '1.6';
                    pre.style.color = '#1f2937';
                    pre.style.whiteSpace = 'pre';
                    pre.style.overflowX = 'auto';
                    pre.style.padding = '20px';
                    pre.style.margin = '0';
                    pre.textContent = cleanedChart;
                    containerRef.current.innerHTML = '';
                    containerRef.current.appendChild(pre);
                    
                    setTimeout(() => {
                        const errorDivs = document.querySelectorAll('div[id^="d"]');
                        errorDivs.forEach(div => {
                            if (div.textContent?.includes('Syntax error') || 
                                div.textContent?.includes('Parse error') ||
                                div.textContent?.includes('mermaid version')) {
                                div.remove();
                            }
                        });
                    }, 100);
                }
            }
        };

        renderDiagram();
    }, [chart, initialized]);

    return (
        <div 
            ref={containerRef} 
            className="flex items-center justify-center w-full min-h-[200px] bg-white rounded-lg"
        />
    );
}