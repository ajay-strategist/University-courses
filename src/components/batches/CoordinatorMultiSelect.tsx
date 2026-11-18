import React from 'react';
import type { Profile } from '@/types';
import { X, UserPlus, Users } from 'lucide-react';

interface CoordinatorMultiSelectProps {
  label: string;
  role: 'college_coordinator' | 'student_coordinator';
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  profiles: Profile[];
  helperText?: string;
}

export const CoordinatorMultiSelect: React.FC<CoordinatorMultiSelectProps> = ({
  label,
  role,
  selectedIds,
  onChange,
  profiles,
  helperText,
}) => {
  // Profiles matching role
  const roleProfiles = profiles.filter((p) => p.role === role);
  // Unselected profiles for dropdown
  const availableProfiles = roleProfiles.filter((p) => !selectedIds.includes(p.id));

  // Selected profile objects
  const selectedProfiles = selectedIds
    .map((id) => profiles.find((p) => p.id === id))
    .filter((p): p is Profile => !!p);

  const handleAdd = (id: string) => {
    if (!id || selectedIds.includes(id)) return;
    onChange([...selectedIds, id]);
  };

  const handleRemove = (idToRemove: string) => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  const isCollege = role === 'college_coordinator';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-muted-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>{label}</span>
          <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
            {selectedProfiles.length}
          </span>
        </label>
        {helperText && <span className="text-[11px] text-muted-foreground italic">{helperText}</span>}
      </div>

      {/* Selected Coordinators Badges / List */}
      <div className="min-h-[38px] p-2 bg-background border border-border rounded-xl flex flex-wrap items-center gap-1.5 focus-within:ring-1 focus-within:ring-primary">
        {selectedProfiles.length === 0 ? (
          <span className="text-xs text-muted-foreground/60 italic pl-1">No coordinators assigned</span>
        ) : (
          selectedProfiles.map((p) => (
            <span
              key={p.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isCollege
                  ? 'bg-primary/10 text-primary border-primary/25 hover:bg-primary/15'
                  : 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/20'
              }`}
              title={`${p.full_name} (${p.email})`}
            >
              <span className="max-w-[140px] truncate">{p.full_name}</span>
              <button
                type="button"
                onClick={() => handleRemove(p.id)}
                className="hover:bg-background/40 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                title={`Remove ${p.full_name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Dropdown to add more */}
      <div className="flex items-center gap-2">
        <select
          value=""
          onChange={(e) => handleAdd(e.target.value)}
          disabled={availableProfiles.length === 0}
          className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 cursor-pointer"
        >
          <option value="" disabled>
            {availableProfiles.length === 0
              ? `All ${roleProfiles.length} registered ${isCollege ? 'college' : 'student'} coordinators assigned`
              : `+ Add ${isCollege ? 'College' : 'Student'} Coordinator...`}
          </option>
          {availableProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name} ({p.email})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
