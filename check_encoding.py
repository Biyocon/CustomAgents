with open('.vscode/.codex/scripts/invoke-agent.ps1', 'rb') as f:
    data = f.read()

print('BOM:', data[:3])
print('Encoding:', 'UTF-8 BOM' if data[:3] == b'\xef\xbb\xbf' else 'No BOM')

# Find non-ASCII in last part
for i, b in enumerate(data):
    if b > 127:
        c = bytes([b]).decode('utf-8', errors='replace')
        print(f'Special byte at {i}: 0x{b:02x} = {c!r}')
        if i > 4000:
            break

print('File size:', len(data))
