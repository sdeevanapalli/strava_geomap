import PersonalRecords from "@/components/PersonalRecords";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { StravaActivity } from "@/types/strava";
import { stravaApi } from "@/lib/strava";
import { mockActivities } from "@/lib/mockData";

export default function RecordsPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);

  useEffect(() => {
    const tokens = storage.getTokens();
    if (tokens) {
      stravaApi
        .fetchActivities(tokens.access_token, 500)
        .then(setActivities)
        .catch(() => setActivities(mockActivities));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Personal Records
      </h1>
      <PersonalRecords activities={activities} />
    </div>
  );
}
