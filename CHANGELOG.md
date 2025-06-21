# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-21

### Added
- Initial release of 8D Tools CLI
- `8d help` command with comprehensive usage information
- `8d init [directory]` command to initialize 8D directory structure
- `8d new <title> [options]` command to create new 8D reports
- `8d link <source> <target> <linkType>` command to link existing reports
- Sequential numbering system for 8D reports (0001, 0002, etc.)
- Automatic table of contents generation and updates
- Comprehensive 8D template covering all eight disciplines (D0-D8)
- Support for superseding reports with `-s` option
- Support for linking reports during creation with `-l` option
- Bidirectional linking between related reports
- File naming convention: `NNNN-title-slug.md`
- Markdown-based reports with structured template
- Cross-platform support (Windows, macOS, Linux)

### Features
- **Template-driven generation**: Uses comprehensive 8D methodology template
- **Sequential numbering**: Automatic sequential numbering like ADR-tools
- **Linking system**: Support for superseding and custom link relationships
- **Table of contents**: Automatic generation and maintenance
- **File management**: Organized directory structure with tracking files
- **CLI interface**: User-friendly command-line interface with help system

### Technical Details
- Built with TypeScript for type safety
- Uses Commander.js for CLI argument parsing
- fs-extra for enhanced file operations
- Chalk for colored terminal output
- Comprehensive test suite with Node.js test runner
- Follows ADR-tools pattern and conventions

### Documentation
- Comprehensive README with usage examples
- Sample 8D report demonstrating full methodology
- API documentation for all commands
- Best practices and workflow guidance

## [Unreleased]

### Planned Features
- Custom templates support
- Export to PDF functionality
- Integration with project management tools
- Web interface for report viewing
- Advanced search and filtering
- Report status tracking
- Team collaboration features
- Metrics and analytics dashboard
