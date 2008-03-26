desc "Instrument source files for coverage analysis"
task :instrument_coverage do
  sh 'jscoverage --no-instrument=vendor/ --no-instrument=spec/ app/ coverage/'
end

desc "Remove generated files"
task :clobber => :clobber_coverage

desc "Remove instrumented source from jscoverage"
task :clobber_coverage do
  rm_rf 'coverage/'
end

desc "BLOCKING TASK: stakeout files"
task :stakeout do
  sh "stakeout 'rake clobber_coverage regen_spec_runner instrument_coverage' app/**/*.js spec/**/*.js pages/**/*.html"
end

desc "Regenerate spec runner index.html"
task :regen_spec_runner do
  sh "erb spec/template.erb > spec/index.html"
end
