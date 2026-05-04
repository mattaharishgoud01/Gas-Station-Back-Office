const fs = require('fs');
const path = require('path');

const brainDir = '/Users/harishgoudmatta/.gemini/antigravity/brain';
const targetPrefix = '/Users/harishgoudmatta/.gemini/antigravity/scratch/backend/src/';

// We want to process logs in chronological order based on created_at or folder creation time
// But we can just find all overview.txt files and sort them by modification time
const getOverviewFiles = () => {
    const folders = fs.readdirSync(brainDir).filter(f => fs.statSync(path.join(brainDir, f)).isDirectory());
    const files = folders.map(f => {
        const p = path.join(brainDir, f, '.system_generated', 'logs', 'overview.txt');
        if (fs.existsSync(p)) {
            return { path: p, mtime: fs.statSync(p).mtimeMs };
        }
        return null;
    }).filter(Boolean);
    return files.sort((a, b) => a.mtime - b.mtime).map(f => f.path);
};

const state = {}; // { filePath: content }

const applyFileOperations = () => {
    const files = getOverviewFiles();
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'PLANNER_RESPONSE' && parsed.tool_calls) {
                    for (const call of parsed.tool_calls) {
                        if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
                            let argsStr = call.args;
                            // the args could be an object if already parsed
                            let args = typeof argsStr === 'string' ? JSON.parse(argsStr) : argsStr;
                            let targetFile = args.TargetFile;
                            if (typeof targetFile === 'string' && targetFile.startsWith('"') && targetFile.endsWith('"')) {
                                targetFile = JSON.parse(targetFile); // unescape if needed
                            }
                            if (targetFile && targetFile.startsWith(targetPrefix)) {
                                if (call.name === 'write_to_file') {
                                    let code = args.CodeContent;
                                    if (typeof code === 'string' && code.startsWith('"') && code.endsWith('"')) {
                                        code = JSON.parse(code);
                                    }
                                    state[targetFile] = code;
                                } else if (call.name === 'replace_file_content' && state[targetFile]) {
                                    let targetContent = args.TargetContent;
                                    let replacementContent = args.ReplacementContent;
                                    if (typeof targetContent === 'string' && targetContent.startsWith('"') && targetContent.endsWith('"')) {
                                        targetContent = JSON.parse(targetContent);
                                    }
                                    if (typeof replacementContent === 'string' && replacementContent.startsWith('"') && replacementContent.endsWith('"')) {
                                        replacementContent = JSON.parse(replacementContent);
                                    }
                                    state[targetFile] = state[targetFile].replace(targetContent, replacementContent);
                                } else if (call.name === 'multi_replace_file_content' && state[targetFile]) {
                                    let chunks = args.ReplacementChunks;
                                    if (typeof chunks === 'string') chunks = JSON.parse(chunks);
                                    for (const chunk of chunks) {
                                        let targetContent = chunk.TargetContent;
                                        let replacementContent = chunk.ReplacementContent;
                                        if (typeof targetContent === 'string' && targetContent.startsWith('"') && targetContent.endsWith('"')) targetContent = JSON.parse(targetContent);
                                        if (typeof replacementContent === 'string' && replacementContent.startsWith('"') && replacementContent.endsWith('"')) replacementContent = JSON.parse(replacementContent);
                                        state[targetFile] = state[targetFile].replace(targetContent, replacementContent);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // ignore parsing errors for non-JSON lines or partial lines
            }
        }
    }
};

applyFileOperations();

for (const [filePath, content] of Object.entries(state)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(`Recovered: ${filePath}`);
}
console.log('Recovery complete!');
