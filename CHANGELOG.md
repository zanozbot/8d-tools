# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-06-23

### Changed

- **File naming convention**: Updated filenames to use zero-padded sequence numbers (0001, 0002, 0003, etc.) while keeping titles with simple numbers (1, 2, 3)
- **Template header formatting**: Added bullet points for bold items in header sections to prevent them from appearing on one line
  - Date and Status now display as `- **Date:** ...` and `- **Status:** ...`
  - Applied to both default and simple templates

### Added

- **New formatting functions**:
  - `formatSequenceNumber()` for titles and display (returns 1, 2, 3)
  - `formatSequenceNumberForFilename()` for filenames (returns 0001, 0002, 0003)
- **Comprehensive documentation**: Created missing `docs/USAGE.md` with detailed usage guide covering:
  - Complete command reference with examples
  - Template system documentation
  - Linking strategies and best practices
  - File organization and naming conventions
  - Troubleshooting guide
  - Advanced usage scenarios

### Fixed

- **File searching**: Updated `findReportByNumber()` functions in both `new.ts` and `link.ts` to correctly search for files using zero-padded format
- **Test coverage**: Updated tests to verify both filename and title formatting functions work correctly

### Technical

- Separated sequence number formatting logic for better maintainability
- Enhanced test suite with additional formatting verification
- Updated documentation to reflect new filename patterns

## [1.0.1] - 2025-06-22

### Fixed

- Fixed README documentation for simple template description to accurately reflect that it follows the full 8D structure (D0-D8) with streamlined content, rather than having completely different sections.

## [1.0.0] - 2025-06-21

### Added

- Initial release of 8D Tools CLI
- `8d help` command with comprehensive usage information
- `8d init [directory]` command to initialize 8D directory structure
- `8d new <title> [options]` command to create new 8D reports
- `8d link <source> <target> <linkType>` command to link existing reports
- `8d template` command suite for template management
- Sequential numbering system for 8D reports (1, 2, 3, etc.)
- Automatic table of contents generation and updates
- Multiple built-in templates:
  - **Default template**: Comprehensive 8D template covering all eight disciplines (D0-D8)
  - **Simple template**: Streamlined template for quick problem-solving
- Custom template system with placeholder support ({{title}}, {{sequence}}, {{date}}, {{links}})
- Template management commands: `list`, `show`, `create`, `delete`
- Support for superseding reports with `-s` option
- Support for linking reports during creation with `-l` option
- Support for template selection with `-t` option
- Bidirectional linking between related reports
- File naming convention: `N-title-slug.md`
- Markdown-based reports with structured templates
- Cross-platform support (Windows, macOS, Linux)

### Features

- **Multi-template system**: Built-in default and simple templates, plus custom template support
- **Template management**: Full CRUD operations for custom templates with placeholder system
- **Sequential numbering**: Simple numbering format (1, 2, 3) following user preferences
- **Linking system**: Support for superseding and custom link relationships
- **Table of contents**: Automatic generation and maintenance
- **File management**: Organized directory structure with tracking files
- **CLI interface**: User-friendly command-line interface with help system

### Technical Details

- Built with TypeScript for type safety
- Uses Commander.js for CLI argument parsing
- fs-extra for enhanced file operations
- Chalk for colored terminal output
- Template engine with placeholder replacement system
- Comprehensive test suite with Vitest
- Follows ADR-tools pattern and conventions

### Documentation

- Comprehensive README with usage examples
- Sample 8D report demonstrating full methodology
- API documentation for all commands
- Best practices and workflow guidance
