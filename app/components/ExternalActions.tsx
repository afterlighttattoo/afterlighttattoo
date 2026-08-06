import { Camera, MapPin } from "lucide-react";
import { studio } from "@/app/data/studio";

export function ExternalActions({ directions = false, className = "" }: { directions?: boolean; className?: string }) {
  return (
    <div className={`external-actions ${className}`.trim()}>
      {directions && (
        <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Get directions to After Light Tattoo in White Oak, Pennsylvania">
          <MapPin aria-hidden="true" size={17} />
          <span>Get Directions</span>
        </a>
      )}
      <a href={studio.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit After Light Tattoo on Instagram in a new tab">
        <Camera aria-hidden="true" size={17} />
        <span>Instagram</span>
      </a>
      <a href={studio.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit After Light Tattoo on Facebook in a new tab">
        <span className="facebook-glyph" aria-hidden="true">f</span>
        <span>Facebook</span>
      </a>
    </div>
  );
}
