'use client';

import type { getPastebinResult } from '@/app/(pastebin)/actions';
import { SearchPastebin } from './search-pastebin';
import { SearchGithubGist } from './search-github-gist';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTemplateContext } from '@/components/template-provider';
import { Button } from '@/components/ui/button';
import { sourceCodePro } from '@/lib/utils';
import { parse } from '@/lib/parser/parser';
import { useState } from 'react';

export function TemplateInput({ input }: { input: { type: string; url: string; error?: string; content: any } }) {
  const { setNodeTree, setErrors } = useTemplateContext();
  const [templateInput, setTemplateInput] = useState(input.content?.content || '');

  const parseInput = () => {
    const [output, errors] = parse(templateInput);
    setNodeTree(output);
    setErrors(errors);
  };
  const pastebin = input.type === 'pastebin' ? input : { type: '', url: '', error: '', content: {} as any };
  const gist = input.type === 'gist' ? input : { type: '', url: '', error: '', content: {} as any };

  return (
    <div className="grid w-full gap-1.5">
      <SearchPastebin defaultValue={pastebin.url} result={pastebin.content} error={pastebin.error} />
      <SearchGithubGist defaultValue={gist.url} error={gist.error} />
      <Label htmlFor="template-input">Input Template</Label>
      <Textarea
        placeholder="Input your text template here."
        id="template-input"
        onChange={(e) => setTemplateInput(e.target.value)}
        value={templateInput}
        className={sourceCodePro.className}
      />
      <Button variant="outline" onClick={() => parseInput()}>
        Generate Form Fields
      </Button>
    </div>
  );
}
