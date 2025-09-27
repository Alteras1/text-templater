'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter } from 'next/navigation';

export function SearchGithubGist({
  defaultValue,
  result,
  error,
}: {
  defaultValue: string;
  result?: any;
  error?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  async function getGist(formData: FormData) {
    const gistUrl = formData.get('gist') as string;
    const id = gistUrl.match(/gist\.github\.com\/(?<username>[\w-]+)\/(?<gistId>[a-f0-9]+)/)?.groups?.gistId;
    if (!id) {
      return {
        errors: 'Invalid GitHub Gist url',
      };
    }

    replace(pathname + '?gist=' + id);
  }

  return (
    <form action={getGist}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="gist">GitHub Gist URL</Label>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="url"
            id="gist"
            name="gist"
            placeholder="https://gist.github.com/username/..."
            defaultValue={defaultValue}
            pattern="(.*)gist\.github\.com\/(.+)\/([a-f0-9]+)"
            required
          />
          <Button type="submit">Get Template</Button>
        </div>
      </div>
    </form>
  );
}
