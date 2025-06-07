import { useEffect, useRef } from "react";

interface CADViewerProps {
  urn: string;
  accessToken: string;
}

const CADViewer = ({ urn, accessToken }: CADViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.Autodesk) return;

    const options = {
      env: "AutodeskProduction",
      accessToken,
    };

    window.Autodesk.Viewing.Initializer(options, () => {
      const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerRef.current!);
      viewer.start();
      const documentId = `urn:${urn}`;
      window.Autodesk.Viewing.Document.load(documentId, (doc) => {
        const defaultView = doc.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(doc, defaultView);
      });
    });
  }, [urn, accessToken]);

  return <div ref={viewerRef} style={{ height: "600px", width: "100%" }} />;
};

export default CADViewer;
