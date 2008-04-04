require 'fileutils'

fs = FileUtils::Verbose

task :default => [:coverage]

desc 'Remove generated files'
task :clobber => :clobber_coverage

desc 'Refresh coverage sources'
task :coverage => [:clobber_coverage, :instrument_coverage]

desc 'Remove instrumented source from jscoverage'
task :clobber_coverage do
  fs.rm_rf 'public/coverage/'
end

task :instrument_coverage do
  fs.cd 'public' do
    sh 'jscoverage',
       '--no-instrument=vendor/',
       '--no-instrument=spec/',
       'app/', 'coverage/'
  end
end

task :stakeout do
  sh 'stakeout', "rant coverage", 'public/**/*.js', 'public/**/*.html'
end

