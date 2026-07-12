// CRACKODH
import { Badge } from "@/components/ui/badge";
import { getLicenseCompliance } from "@/lib/drivers/constants";

export function LicenseComplianceBadge({ licenseExpiryDate }: { licenseExpiryDate: string }) {
  const compliance = getLicenseCompliance(licenseExpiryDate);

  return <Badge variant={compliance.variant}>{compliance.label}</Badge>;
}
