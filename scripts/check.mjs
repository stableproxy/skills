import {execSync} from "node:child_process"
import {existsSync, readdirSync, readFileSync} from "node:fs"
import {join} from "node:path"

const errors = []
const fail = message => errors.push(message)
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/

const frontmatter = text => {
	const match = /^---\n([\s\S]*?)\n---\n/.exec(text)
	if (!match) return null
	return Object.fromEntries(match[1].split("\n").map(line => line.match(/^([a-z-]+):\s*(.*)$/)).filter(Boolean).map(m => [m[1], m[2].trim()]))
}

for (const dir of readdirSync("skills", {withFileTypes: true}).filter(entry => entry.isDirectory())) {
	const file = join("skills", dir.name, "SKILL.md")
	if (!existsSync(file)) {
		fail(`${file} is missing`)
		continue
	}
	const text = readFileSync(file, "utf8")
	const meta = frontmatter(text)
	if (!meta) {
		fail(`${file}: no frontmatter`)
		continue
	}
	if (meta.name !== dir.name) fail(`${file}: name "${meta.name}" must equal the folder name "${dir.name}"`)
	if (!NAME.test(meta.name || "") || meta.name.length > 64) fail(`${file}: name must be lowercase words joined by "-" (max 64)`)
	if (!meta.description || meta.description.length > 1024) fail(`${file}: description is required (max 1024 characters)`)
	for (const [, link] of text.matchAll(/\]\(((?!https?:)[^)#]+)\)/g)) {
		if (!existsSync(join("skills", dir.name, link))) fail(`${file}: broken link ${link}`)
	}
}

const json = file => {
	try {
		return JSON.parse(readFileSync(file, "utf8"))
	} catch (error) {
		fail(`${file}: ${error.message}`)
		return {}
	}
}

const marketplace = json(".claude-plugin/marketplace.json")
const plugin = json(".claude-plugin/plugin.json")
const mcp = json(".mcp.json")

if (!marketplace.plugins?.some(entry => entry.name === plugin.name)) fail("marketplace.json must list the plugin from plugin.json")
if (!/^\d+\.\d+\.\d+$/.test(plugin.version || "")) fail("plugin.json version must be semver")
if (!mcp.mcpServers?.stableproxy?.url && !mcp.mcpServers?.stableproxy?.command) fail(".mcp.json must define mcpServers.stableproxy (url or command)")

const base = process.env.BASE_REF
if (base) {
	const changed = execSync(`git diff --name-only origin/${base}...HEAD`, {encoding: "utf8"}).split("\n").filter(Boolean)
	const shipped = changed.some(path => path.startsWith("skills/") || path === ".mcp.json")
	if (shipped) {
		const before = JSON.parse(execSync(`git show origin/${base}:.claude-plugin/plugin.json`, {encoding: "utf8"})).version
		if (before === plugin.version) fail(`skills or .mcp.json changed: bump the version in .claude-plugin/plugin.json (still ${before})`)
	}
}

if (errors.length) {
	console.error(errors.map(error => `✗ ${error}`).join("\n"))
	process.exit(1)
}

console.log("✓ skills, marketplace and plugin are valid")
