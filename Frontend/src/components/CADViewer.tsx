import { useEffect, useRef } from 'react';

// Type definitions for Autodesk Forge Viewer
declare global {
  interface Window {
    Autodesk: {
      Viewing: {
        Initializer: (options: ForgeInitializerOptions, callback: () => void) => void;
        GuiViewer3D: new (container: HTMLElement, config: Viewer3DConfig) => Viewer3D;
        Document: {
          load: (documentId: string, onSuccess: (doc: Document) => void, onError: (error: Error) => void) => void;
        };
      };
    };
  }
}

interface ForgeInitializerOptions {
  env: string;
  api: string;
  accessToken: string;
}

interface Viewer3DConfig {
  extensions?: string[];
}

interface Viewer3D {
  start: () => void;
  loadDocumentNode: (doc: Document, node: DocumentNode) => void;
  finish: () => void;
}

interface Document {
  getRoot: () => {
    getDefaultGeometry: () => DocumentNode;
  };
}

interface StructuralProperties {
  walls: {
    thickness: number;
    material: string;
    fireRating: string;
  };
  doors: {
    width: number;
    height: number;
    swingDirection: string;
    fireRating: string;
  };
  windows: {
    area: number;
    glazingType: string;
    emergencyEgress: boolean;
  };
}

interface SpatialProperties {
  area: number;          // Area in square meters
  volume: number;        // Volume in cubic meters
  perimeter: number;     // Perimeter length
  height: number;        // Room/ceiling height
}

interface RoomProperties {
  name: string;          // "Living Room", "Bathroom", etc.
  type: string;          // "Room", "Corridor", "Staircase"
  category: string;      // "Residential", "Commercial", "Utility"
  occupancy: number;     // Maximum occupancy
}

interface ComplianceProperties {
  fireExits: number;
  accessibilityFeatures: {
    wheelchairAccess: boolean;
    rampWidth?: number;
    doorWidth?: number;
  };
  utilityConnections: {
    water: boolean;
    electricity: boolean;
    sewage: boolean;
  };
}

interface DocumentNode {
  id: string;
  name: string;
  guid: string;

  properties: {
    spatial: SpatialProperties;
    room?: RoomProperties;
    structural?: StructuralProperties;
    compliance?: ComplianceProperties;
  };

  parent?: DocumentNode;
  children?: DocumentNode[];

  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };

   metadata: {
    createdAt: string;
    modifiedAt: string;
    author: string;
    units: 'meters' | 'feet';
  };
}

interface CADViewerProps {
  urn: string;
  accessToken: string;
}

const CADViewer = ({ urn, accessToken }: CADViewerProps) => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer3D | null>(null);

  useEffect(() => {
    if (!urn || !accessToken || !viewerContainer.current) return;

    const loadForgeViewer = async () => {
      try {
        // Load Forge Viewer scripts
        await loadScript('https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js');
        
        const options: ForgeInitializerOptions = {
          env: 'AutodeskProduction',
          api: 'derivativeV2',
          accessToken,
        };

        window.Autodesk.Viewing.Initializer(options, () => {
          if (!viewerContainer.current) return;

          const viewer = new window.Autodesk.Viewing.GuiViewer3D(
            viewerContainer.current,
            { extensions: ['Autodesk.DocumentBrowser'] }
          );
          
          viewerRef.current = viewer;
          viewer.start();
          
          const documentId = `urn:${urn}`;
          window.Autodesk.Viewing.Document.load(
            documentId,
            (doc: Document) => {
              if (viewerRef.current) {
                viewerRef.current.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());
              }
            },
            (error: Error) => console.error('Document load error:', error)
          );
        });
      } catch (error) {
        console.error('Failed to load Forge Viewer:', error);
      }
    };

    loadForgeViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.finish();
        viewerRef.current = null;
      }
    };
  }, [urn, accessToken]);

  const loadScript = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  };

  return <div ref={viewerContainer} style={{ width: '100%', height: '600px' }} />;
};

export default CADViewer;